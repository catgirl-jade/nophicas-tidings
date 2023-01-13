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
import { WorkerData } from "./common";
import { find_icons, get_item_base_scores, get_icon_url } from "./xivapi";

//TODO: check if importing wasm module incurs double-overhead
import * as nophicas_tidings from "../pkg";
// CSS??
import "./main.css";
import { createDecipher } from "crypto";

/// Globals referencing HTML fields
/// The whole form
const form_params: HTMLElement = document.getElementById("parameters")!;
// Player stats
/// Level
const input_player_level = <HTMLInputElement> document.getElementById("player_level")!;
/// GP 
const input_player_gp = <HTMLInputElement> document.getElementById("player_gp")!;
/// Gathering 
const input_player_gathering = <HTMLInputElement> document.getElementById("player_gathering")!;
/// Perception
const input_player_perception = <HTMLInputElement> document.getElementById("player_perception")!;
// Node stats
/// Durability 
const input_node_durability = <HTMLInputElement> document.getElementById("node_durability")!;
// Item stats
// Item level
const input_item_level = <HTMLInputElement> document.getElementById("item_level")!;
// Calculated from item level
/// Gathering base score
const div_item_gathering = <HTMLElement> document.getElementById("item_gathering")!;
const span_item_gathering_value = <HTMLElement> document.getElementById("item_gathering_value")!;
/// Perception base score
const div_item_perception = <HTMLElement> document.getElementById("item_perception")!;
const span_item_perception_value = <HTMLElement> document.getElementById("item_perception_value")!;
/// Chance to successfully gather
const label_success_chance = <HTMLLabelElement> document.getElementById("label_success_chance")!;
const input_item_success_chance = <HTMLInputElement> document.getElementById("item_success_chance")!;
/// Base amount
const input_item_gather_amount = <HTMLInputElement> document.getElementById("item_gather_amount")!;
/// Chance to trigger gatherers boon
const label_boon_chance = <HTMLLabelElement> document.getElementById("label_boon_chance")!;
const input_item_boon_chance = <HTMLInputElement> document.getElementById("item_boon_chance")!;
/// Amount granted by bountiful yield
const label_bountiful_bonus = <HTMLLabelElement> document.getElementById("label_bountiful_bonus")!;
const input_item_bountiful_bonus = <HTMLInputElement> document.getElementById("item_bountiful_bonus")!;
/// Button to perform simulation
const input_submit = <HTMLInputElement> document.getElementById("submit")!;
const div_calc_message: HTMLElement = document.getElementById("calc_message")!;
/// Stores result of calculation
const div_result: HTMLElement = document.getElementById("result_rotation")!;
/// Wrapper div for number of items
const div_result_items_outer: HTMLElement = div_result.querySelector("#result_items_outer")!;
/// Produced number of items written here
const span_result_items: HTMLElement = div_result_items_outer.querySelector("#result_items")!;
// Search modal and related elements
const button_search_modal = <HTMLButtonElement> document.getElementById("button_search_modal")!;
const input_search = <HTMLInputElement> document.getElementById("input_search")!;
const button_search_execute = <HTMLButtonElement> document.getElementById("button_search_execute")!;

// Keys used to store player stats in localStorage
const LEVEL_KEY: string = "level"; 
const GP_KEY: string = "gp"; 
const GATHERING_KEY: string = "gathering";
const PERCEPTION_KEY: string = "perception";

/// Global reference to the web worker
const worker = function() {
  if (window.Worker) {
    return new Worker(new URL('./worker.ts', import.meta.url));
  } else {
    return null;
  }
}();

// On page load, we can check localStorage and load the player's saved stats
function load_and_set_save_callback(input: HTMLInputElement, key: string) {
  let saved_value = localStorage.getItem(key);
  if (saved_value) {
    input.value = saved_value;
  }
  input.addEventListener("change", (ev: Event) => {
    localStorage.setItem(key, input.value);
  });
}
load_and_set_save_callback(input_player_level, "level");
load_and_set_save_callback(input_player_gp, "gp");
load_and_set_save_callback(input_player_gathering, "gathering");
load_and_set_save_callback(input_player_perception, "perception");

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
      let url = get_icon_url(type, id); 
      if (url) {
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
    div_items.classList.add("align-items-center");
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
  find_icons("item", item_icons.keys()); 
  find_icons("action", action_icons.keys());
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
  input_player_gathering.disabled = value;
  input_player_perception.disabled = value;
  input_node_durability.disabled = value;
  input_item_level.disabled = value;
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
async function update_from_item_level(ev: Event | null) {
  let item_level = parseInt(input_item_level.value);
  // Mark the valids invalid until we have new values
  mark_validity(div_item_gathering, false);
  mark_validity(div_item_perception, false);
  span_item_gathering_value.innerText = "...";
  span_item_perception_value.innerText = "...";
  // Request the new stats
  let new_stats = await get_item_base_scores(item_level);
  span_item_gathering_value.innerText = new_stats.gathering.toString();
  span_item_perception_value.innerText = new_stats.perception.toString();
  // Mark the stats as valid again
  mark_validity(div_item_gathering, true);
  mark_validity(div_item_perception, true);
  // Since we're recalculating item stats, update the dependent variables
  update_from_gathering(null);
  update_from_perception(null);
  return false;
}
// Set the callback
input_item_level.onchange = update_from_item_level;
// Call it once for the first time so we have initial values
await update_from_item_level(null);

// Updates variables that are based on player gathering score
function update_from_gathering(ev: Event | null) {
  // Read both gathering scores
  let player_gathering = parseInt(input_player_gathering.value);
  let item_gathering = parseInt(span_item_gathering_value.innerText);
  // Calculate success rate and bountiful bonus
  let success_rate = nophicas_tidings.success_chance(player_gathering, item_gathering);
  let bountiful_bonus = nophicas_tidings.bountiful_amount(player_gathering, item_gathering);
  // TODO: unremove once we have the algo right
  // input_item_success_chance.value = success_rate.toString();
  // mark_validity(label_success_chance, true);
  input_item_bountiful_bonus.value = bountiful_bonus.toString();
  mark_validity(label_bountiful_bonus, true);
}
// Set the callback
input_player_gathering.addEventListener("change", update_from_gathering);
// Call it once
update_from_gathering(null);

// Updates variables based on gathering scores
function update_from_perception(ev: Event | null) {
  // Read both perception scores
  let player_perception = parseInt(input_player_perception.value);
  let item_perception = parseInt(span_item_perception_value.innerText);
  // Calculate boon rate
  let boon_rate = nophicas_tidings.boon_chance(player_perception, item_perception);
  // Save boon rate and mark it valid
  input_item_boon_chance.value = boon_rate.toString();
  mark_validity(label_boon_chance, true);
}
// Set the callback
input_player_perception.addEventListener("change", update_from_perception);
// Call it once
update_from_perception(null);

// Marks a label/div as validated or invalidated
function mark_validity(label: HTMLLabelElement | HTMLElement, validity: boolean) {
  if (validity) {
    label.classList.add("validated");
    label.classList.remove("unvalidated");
  }
  else {
    label.classList.add("unvalidated");
    label.classList.remove("validated");
  }
}

/// This function creates a callback which invalidates a label when a calculated value is modified manually
function create_invalidate_callback(label: HTMLLabelElement) {
  return function(ev: Event) {
    mark_validity(label, false);
  }
} 
input_item_boon_chance.onchange = create_invalidate_callback(label_boon_chance);
input_item_bountiful_bonus.onchange = create_invalidate_callback(label_bountiful_bonus);

// Add search functionality
button_search_modal.onclick = async function(event: MouseEvent) {
  // Reset the search box
  input_search.value = "";
  return true; 
}
button_search_execute.onclick = async function(event: MouseEvent) {
  // Disable default behavior
  event.preventDefault();
  // Get the text of the search phrase
  let search_phrase = input_search.value;
  // Perform a search
  return false; 
}
