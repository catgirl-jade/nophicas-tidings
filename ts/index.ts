// Copyright 2023 catgirl-jade
// 
// This file is part of nophicas-tidings.
// 
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
// 
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.

/// Imports
import { WorkerData } from "./common.js";
//TODO: check if importing wasm module incurs double-overhead
import * as nophicas_tidings from "../pkg";
// CSS??
import "./main.css";

/// API URL for xivapi
const XIVAPI_BASE: string = "https://xivapi.com";

/// Globals referencing HTML fields
const form_params: HTMLElement = document.getElementById("parameters")!;
const input_player_level = <HTMLInputElement> document.getElementById("player_level")!;
const input_player_gp = <HTMLInputElement> document.getElementById("player_gp")!;
const input_node_durability = <HTMLInputElement> document.getElementById("node_durability")!;
const input_item_success_chance = <HTMLInputElement> document.getElementById("item_success_chance")!;
const input_item_gather_amount = <HTMLInputElement> document.getElementById("item_gather_amount")!;
const input_item_boon_chance = <HTMLInputElement> document.getElementById("item_boon_chance")!;
const input_item_bountiful_bonus = <HTMLInputElement> document.getElementById("item_bountiful_bonus")!;
const input_submit = <HTMLInputElement> document.getElementById("submit")!;
const div_calc_message: HTMLElement = document.getElementById("calc_message")!;
// Stores result of calculation
const div_result: HTMLElement = document.getElementById("result_rotation")!;
// Wrapper div for number of items
const div_result_items_outer: HTMLElement = div_result.querySelector("#result_items_outer")!;
// Action number of items written here
const span_result_items: HTMLElement = div_result_items_outer.querySelector("#result_items")!;

/// Global reference to the web worker
const worker = function() {
  if (window.Worker) {
    return new Worker(new URL('./worker.ts', import.meta.url));
  } else {
    return null;
  }
}();

// Quick helper function to reduce duplication
function make_icon_key(t: string, id: number): string {
  return `icon/${t}/${id}`;
}

/// Checks local cache for image urls before hitting XIVAPI
async function get_icons(ty: string, ids: Iterable<number>) {
  let unknown_ids = new Array<number>();
  for (let id of ids) {
    let key = make_icon_key(ty, id); 
    let path = localStorage.getItem(key);
    if (!path) {
      unknown_ids.push(id);
    }
  }
  let id_string = unknown_ids.map((id) => id.toString()).join(",");
  if (unknown_ids.length > 0) {
    // Batch all the unknown ids into a single request
    let resp = await fetch(`${XIVAPI_BASE}/${ty}?` + new URLSearchParams({ids: id_string}));
    let body = await resp.json();
    // Cache all the newly requested ids
    for (let result of body.Results) {
      let key = make_icon_key(ty, result.ID);
      localStorage.setItem(key, result.Icon);
    }
  }
}


/// Wrapper function to perform the calculation
async function do_calculations(
  player_level: number,
  player_gp: number,
  node_durability: number,
  item_success_chance: number,
  item_gather_amount: number,
  item_boon_chance: number,
  item_bountiful_bonus: number,
) {
  return nophicas_tidings.generate_rotation(
    player_level,
    player_gp,
    node_durability,
    item_success_chance,
    item_gather_amount,
    item_boon_chance,
    item_bountiful_bonus,
  );
}

async function display_result(result: any) {
  // Hide the calculation message
  div_calc_message.style.display = "none";
  // Report the resulting rotation
  div_result_items_outer.style.display = "inline";
  span_result_items.innerText = result.items;
  // Store a list of icons we need to request
  let action_icons = new Map<number, Array<HTMLImageElement>>();
  let item_icons = new Map<number, Array<HTMLImageElement>>();
  // A convenience function for updating these
  function update_icon_list(
    icons: Map<number, Array<HTMLImageElement>>,
    id: number,
    image: HTMLImageElement,
  ) {
    if (icons.has(id)) {
      icons.get(id)!.push(image); 
    }
    else {
      icons.set(id, new Array(image));
    }
  }
  function update_icon_lists(
    type: string,
    id: number,
    image: HTMLImageElement,
  ) {
    if (type == "action") {
        update_icon_list(action_icons, id, image);
    }
    else if (type == "item") {
        update_icon_list(item_icons, id, image);
    }
  }
  function render_icons(
    icons: Map<number, Array<HTMLImageElement>>,
    type: string
  ) {
    for (let [id, imgs] of icons) {
      let key = make_icon_key(type, id);
      let path = localStorage.getItem(key);
      if (path) {
        let url = `${XIVAPI_BASE}${path}`;
        for (let img of imgs) {
          img.src = url;
        }
      }
    }
  }

  // Store a mapping of img element -> icon so we know where to set them
  // Create a div for each element of the rotation
  for (let action of result.actions) {
    // Div storing all the info for an action stage
    const div_action = document.createElement("div");
    div_action.classList.add("row");
    div_action.classList.add("action-row");
    // The number of items gathered
    const div_items = document.createElement("div");
    div_items.classList.add("col-sm-1");
    div_items.classList.add("action-quantity");
    if (action.action.hasOwnProperty("amount")) {
      div_items.innerText = `${action.action.amount}`
    }
    div_action.appendChild(div_items);
    // The icons for the ability
    const div_icons = document.createElement("div");
    div_icons.classList.add("col-sm-auto");
    div_icons.classList.add("action-icons");
    const img_min = document.createElement("img");
    div_icons.appendChild(img_min);
    const img_btn= document.createElement("img");
    div_icons.appendChild(img_btn);
    div_action.appendChild(div_icons);
    // The name of the ability
    const div_name = document.createElement("div");
    div_name.classList.add("col");
    div_name.classList.add("action_name");
    div_name.innerText = action.action.name;
    div_action.appendChild(div_name);
    // Whether the ability depends on casts of Wise to the World
    // Finally, store the row into the action list 
    div_result.appendChild(div_action);
    // Finally, store some references for the icons
    let icon_min = action.action.id_min;
    let icon_btn = action.action.id_btn;
    update_icon_lists(icon_min.type, icon_min.id, img_min);  
    update_icon_lists(icon_btn.type, icon_btn.id, img_btn); 
  }
  // Finally, we want to request icons
  get_icons("item", item_icons.keys()); 
  get_icons("action", action_icons.keys());
  // Render the icons
  render_icons(item_icons, "item");
  render_icons(action_icons, "action");
  // Cleanup and return the page to become usable again
  set_form_disabled(false);
}


/// Either enables or disables all elements of the form
function set_form_disabled(value: boolean) {
  // Set submit first
  input_submit.disabled = value;
  input_player_level.disabled = value;
  input_player_gp.disabled = value;
  input_node_durability.disabled = value;
  input_item_success_chance.disabled = value;
  input_item_gather_amount.disabled = value;
  input_item_boon_chance.disabled = value;
  input_item_bountiful_bonus.disabled = value;
}
/// Performs and writes calculations
async function start_calculations() {
  // Disable all fields from being written
  set_form_disabled(true);
  // Read all the fields
  let player_level = parseInt(input_player_level.value);
  let player_gp = parseInt(input_player_gp.value);
  let node_durability = parseInt(input_node_durability.value);
  let item_success_chance = parseInt(input_item_success_chance.value);
  let item_gather_amount = parseInt(input_item_gather_amount.value);
  let item_boon_chance = parseInt(input_item_boon_chance.value);
  let item_bountiful_bonus = parseInt(input_item_bountiful_bonus.value);
  // Clear out the 2 output fields in case there was data in them
  div_result_items_outer.style.display = "none";
  // Remove all action rows from the results
  div_result.querySelectorAll("div.action-row").forEach(row => {
    row.parentNode!.removeChild(row)
  });
  // Turn on the calculating message
  div_calc_message.style.display = "inline";
  if (worker) {
    // Aggregate all the data together into an object
    let data = {
      player_level,
      player_gp,
      node_durability,
      item_success_chance,
      item_gather_amount,
      item_boon_chance,
      item_bountiful_bonus
    };
    // Set up the response callback beforehand
    worker.onmessage = async (evt: MessageEvent) => {
      let result: any = evt.data;
      console.debug("Got response from worker");
      await display_result(result);
    };
    // Send the data to the worker
    await worker.postMessage(data);
  }
  else {
    let result: any = await do_calculations(
      player_level,
      player_gp,
      node_durability,
      item_success_chance,
      item_gather_amount,
      item_boon_chance,
      item_bountiful_bonus,
    );
    display_result(result);
  }
}

// On submission, the form will perform calculation 
form_params.onsubmit = async function(ev) {
  ev.preventDefault();
  await start_calculations();
  return false;
}
