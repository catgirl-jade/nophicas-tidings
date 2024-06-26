/*! 
 * Copyright 2023 catgirl-jade
 * 
 * This file is part of nophicas-tidings.
 * 
 * nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * 
 * nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.
 */

/// Imports
import { WorkerData } from "./common";
import { find_icons, get_item_base_scores, get_icon_url, search_gatherable } from "./xivapi";
import { Modal } from "bootstrap";

// Bootstrap scss + others 
import '../scss/styles.scss'

//TODO: check if importing wasm module incurs double-overhead
import * as nophicas_tidings from "../pkg";

/// Globals referencing HTML fields
/// The whole form
const form_params = <HTMLFormElement> document.querySelector("form#parameters")!;
// Player stats
/// Level
const input_player_level = <HTMLInputElement> document.querySelector("input#player_level")!;
/// GP 
const input_player_gp = <HTMLInputElement> document.querySelector("input#player_gp")!;
const input_player_gp_max = <HTMLInputElement> document.querySelector("input#player_gp_max")!;
/// Gathering 
const input_player_gathering = <HTMLInputElement> document.querySelector("input#player_gathering")!;
/// Perception
const input_player_perception = <HTMLInputElement> document.querySelector("input#player_perception")!;
// Node stats
/// Durability 
const input_node_durability = <HTMLInputElement> document.querySelector("input#node_durability")!;
// Revisit chance
const input_node_revisit_chance = <HTMLInputElement> document.querySelector("input#node_revisit_chance")!;
// Item stats
// Item level
const input_gathering_level = <HTMLInputElement> document.querySelector("input#gathering_level")!;
// Calculated from item level
/// Gathering base score
const input_item_gathering = <HTMLInputElement> document.querySelector("input#item_gathering")!;
const span_item_gathering_value = <HTMLSpanElement> document.querySelector("span#item_gathering_value")!;
/// Perception base score
const input_item_perception = <HTMLInputElement> document.querySelector("input#item_perception")!;
const span_item_perception_value = <HTMLSpanElement> document.querySelector("span#item_perception_value")!;
/// Chance to successfully gather
const label_success_chance = <HTMLLabelElement> document.querySelector("label#label_success_chance")!;
const input_item_success_chance = <HTMLInputElement> document.querySelector("input#item_success_chance")!;
/// Base amount
const input_item_gather_amount = <HTMLInputElement> document.querySelector("input#item_gather_amount")!;
/// Chance to trigger gatherers boon
const input_item_boon_chance = <HTMLInputElement> document.querySelector("input#item_boon_chance")!;
const input_item_boon_chance_bonus= <HTMLInputElement> document.querySelector("input#item_boon_chance_bonus")!;
const input_item_boon_chance_total = <HTMLInputElement> document.querySelector("input#item_boon_chance_total")!;
/// Amount granted by bountiful yield
const input_item_bountiful_bonus = <HTMLInputElement> document.querySelector("input#item_bountiful_bonus")!;
/// Button to perform simulation
const input_submit = <HTMLInputElement> document.querySelector("input#submit")!;
const div_calc_message = <HTMLDivElement> document.querySelector("div#calc_message")!;
/// Stores result of calculation
const div_result = <HTMLDivElement> document.querySelector("div#result_rotation")!;
/// Wrapper div for number of items
const div_result_items_outer: HTMLDivElement = div_result.querySelector("div#result_items_outer")!;
/// Produced number of items written here
const span_result_items: HTMLSpanElement = div_result_items_outer.querySelector("span#result_items")!;
// Search modal and related elements
const button_search_modal = <HTMLButtonElement> document.querySelector("button#button_search_modal")!;
const div_search_modal = <HTMLDivElement> document.querySelector("div#search_modal");
const form_search = <HTMLFormElement> document.querySelector("form#form_search")!;
const input_search = <HTMLInputElement> document.querySelector("input#search")!;
const button_search_execute = <HTMLButtonElement> document.querySelector("button#button_search_execute")!;
const div_search_results = <HTMLDivElement> document.querySelector("div#search_results");

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
load_and_set_save_callback(input_player_gp_max, "gp_max");
load_and_set_save_callback(input_player_gathering, "gathering");
load_and_set_save_callback(input_player_perception, "perception");

/// Wrapper function to perform the calculation
async function do_calculations(
  player_level: number,
  player_gp: number,
  player_gp_max: number,
  node_durability: number,
  node_revisit_chance: number,
  item_success_chance: number,
  item_gather_amount: number,
  item_boon_chance: number,
  item_bountiful_bonus: number,
) {
  return nophicas_tidings.generate_rotation(
    player_level,
    player_gp,
    player_gp_max,
    node_durability,
    node_revisit_chance,
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
  // A convenience function for updating these
  function update_icon_list(
    id: number,
    image: HTMLImageElement,
  ) {
    if (action_icons.has(id)) {
      action_icons.get(id)!.push(image); 
    }
    else {
      action_icons.set(id, new Array(image));
    }
  }
  function render_icons(
    icons: Map<number, Array<HTMLImageElement>>,
  ) {
    for (let [id, imgs] of icons) {
      let url = get_icon_url(id); 
      if (url) {
        for (let img of imgs) {
          img.src = url;
        }
      }
    }
  }
  // Track items so far
  let items_so_far = 0;
  // Store a mapping of img element -> icon so we know where to set them
  // Create a div for each element of the rotation
  for (let action_log of result.actions) {
    if (action_log.hasOwnProperty('Action')) {
      let action = action_log.Action;
      // Div storing all the info for an action stage
      const div_action = document.createElement("div");
      div_action.classList.add("row");
      div_action.classList.add("action-row");
      // The number of items gathered
      const div_items = document.createElement("div");
      div_items.classList.add("col-sm-1");
      div_items.classList.add("align-items-center");
      div_items.classList.add("action-quantity");
      // The number of items gathered (cumulative)
      const div_items_cum = document.createElement("div");
      div_items_cum.classList.add("col-sm-1");
      div_items_cum.classList.add("align-items-center");
      div_items_cum.classList.add("action-quantity");
      if (action.action.hasOwnProperty("amount")) {
        div_items.innerText = `${action.action.amount}`
        items_so_far += parseFloat(action.action.amount);
        div_items_cum.innerText = `${items_so_far.toFixed(2)}`
      }
      div_action.appendChild(div_items);
      div_action.appendChild(div_items_cum);
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
      update_icon_list(action.action.id_min, img_min);  
      update_icon_list(action.action.id_btn, img_btn);
    }
    else {
      // Create a row signifying a revisit
      let div_revisit_row = document.createElement("div");
      div_revisit_row.classList.add("row");
      div_revisit_row.classList.add("action-row");
      // Add message
      let div_revisit_message = document.createElement("div");
      div_revisit_message.classList.add("align-items-center");
      div_revisit_message.innerText = "Revisit";
      div_revisit_row.appendChild(div_revisit_message);
      // Append the revisit
      div_result.appendChild(div_revisit_row);
    }
  }
  // Finally, we want to request icons
  find_icons(action_icons.keys());
  // Render the icons
  render_icons(action_icons);
  // Cleanup and return the page to become usable again
  set_form_disabled(false);
}


/// Either enables or disables all elements of the form
function set_form_disabled(value: boolean) {
  // Set submit first
  input_submit.disabled = value;
  input_player_level.disabled = value;
  input_player_gp.disabled = value;
  input_player_gp_max.disabled = value;
  input_player_gathering.disabled = value;
  input_player_perception.disabled = value;
  input_node_durability.disabled = value;
  input_gathering_level.disabled = value;
  input_item_success_chance.disabled = value;
  input_item_gather_amount.disabled = value;
  input_item_boon_chance.disabled = value;
  input_item_boon_chance_bonus.disabled = value;
  input_item_bountiful_bonus.disabled = value;
}

async function calculate_rotation_then(
  player_level: number,
  player_gp: number,
  player_gp_max: number,
  node_durability: number,
  node_revisit_chance: number,
  item_success_chance: number,
  item_gather_amount: number,
  item_boon_chance: number,
  item_bountiful_bonus: number,
  after: (_: any) => void
) {
  if (worker) {
    // Aggregate all the data together into an object
    let data = {
      player_level,
      player_gp,
      player_gp_max,
      node_durability,
      node_revisit_chance,
      item_success_chance,
      item_gather_amount,
      item_boon_chance,
      item_bountiful_bonus
    };
    // Set up the response callback beforehand
    worker.onmessage = async (evt: MessageEvent) => {
      let result: any = evt.data;
      console.debug("Got response from worker");
      await after(result);
    };
    // Send the data to the worker
    await worker.postMessage(data);
  }
  else {
    let result: any = await do_calculations(
      player_level,
      player_gp,
      player_gp_max,
      node_durability,
      node_revisit_chance,
      item_success_chance,
      item_gather_amount,
      item_boon_chance,
      item_bountiful_bonus,
    );
    await after(result);
  }
} 

/// Performs and writes calculations
async function start_calculations() {
  // Disable all fields from being written
  set_form_disabled(true);
  // Read all the fields
  let player_level = parseInt(input_player_level.value);
  let player_gp = parseInt(input_player_gp.value);
  let player_gp_max = parseInt(input_player_gp_max.value);
  let node_durability = parseInt(input_node_durability.value);
  let node_revisit_chance = parseInt(input_node_revisit_chance.value);
  let item_success_chance = parseInt(input_item_success_chance.value);
  let item_gather_amount = parseInt(input_item_gather_amount.value);
  let item_boon_chance = parseInt(input_item_boon_chance_total.value);
  let item_bountiful_bonus = parseInt(input_item_bountiful_bonus.value);
  // Clear out the 2 output fields in case there was data in them
  div_result_items_outer.style.display = "none";
  // Remove all action rows from the results
  div_result.querySelectorAll("div.action-row").forEach(row => {
    row.parentNode!.removeChild(row)
  });
  // Turn on the calculating message
  div_calc_message.style.display = "inline";
  // Perform and display the calculations
  calculate_rotation_then(
      player_level,
      player_gp,
      player_gp_max,
      node_durability,
      node_revisit_chance,
      item_success_chance,
      item_gather_amount,
      item_boon_chance,
      item_bountiful_bonus,
    display_result
  );
}

// On submission, the form will perform calculation 
form_params.onsubmit = async function(ev) {
  ev.preventDefault();
  await start_calculations();
  return false;
}
async function update_from_gathering_level(ev: Event | null) {
  let gathering_level = parseInt(input_gathering_level.value);
  // Mark the valids invalid until we have new values
  mark_validity(input_item_gathering, false);
  mark_validity(input_item_perception, false);
  input_item_gathering.value= "...";
  input_item_perception.value = "...";
  // Request the new stats
  let new_stats = await get_item_base_scores(gathering_level);
  input_item_gathering.value = new_stats.gathering.toString();
  input_item_perception.value= new_stats.perception.toString();
  // Mark the stats as valid again
  mark_validity(input_item_gathering, true);
  mark_validity(input_item_perception, true);
  // Since we're recalculating item stats, update the dependent variables
  update_from_gathering(null);
  update_from_perception(null);
  return false;
}
// Set the callback
input_gathering_level.onchange = update_from_gathering_level;
// Call it once for the first time so we have initial values
await update_from_gathering_level(null);

// Updates variables that are based on player level
function update_from_level(ev: Event | null) {
  // Read both gathering scores
  let player_gathering = parseInt(input_player_gathering.value);
  let item_gathering = parseInt(input_item_gathering.value);
  // Read player level
  let player_level = parseInt(input_player_level.value);
  // Calculate success rate and bountiful bonus
  let bountiful_bonus = nophicas_tidings.bountiful_amount(player_level, player_gathering, item_gathering);
  input_item_bountiful_bonus.value = bountiful_bonus.toString();
  mark_validity(input_item_bountiful_bonus, true);
}
// Set the callback
input_player_level.addEventListener("change", update_from_level);
// Call it once
update_from_level(null);


// Updates variables that are based on player gathering score
function update_from_gathering(ev: Event | null) {
  // Read both gathering scores
  let player_gathering = parseInt(input_player_gathering.value);
  let item_gathering = parseInt(input_item_gathering.value);
  // Read player level
  let player_level = parseInt(input_player_level.value);
  // Calculate success rate and bountiful bonus
  let success_rate = nophicas_tidings.success_chance(player_gathering, item_gathering);
  let bountiful_bonus = nophicas_tidings.bountiful_amount(player_level, player_gathering, item_gathering);
  // TODO: unremove once we have the algo right
  // input_item_success_chance.value = success_rate.toString();
  // mark_validity(label_success_chance, true);
  input_item_bountiful_bonus.value = bountiful_bonus.toString();
  mark_validity(input_item_bountiful_bonus, true);
}
// Set the callback
input_player_gathering.addEventListener("change", update_from_gathering);
// Call it once
update_from_gathering(null);

// Updates variables based on gathering scores
function update_from_perception(ev: Event | null) {
  // Read both perception scores
  let player_perception = parseInt(input_player_perception.value);
  let item_perception = parseInt(input_item_perception.value);
  // Calculate boon rate
  let boon_rate = nophicas_tidings.boon_chance(player_perception, item_perception);
  // Save boon rate and mark it valid
  input_item_boon_chance.value = boon_rate.toString();
  mark_validity(input_item_boon_chance, true);
  update_boon_total(ev);
}
// Set the callback
input_player_perception.addEventListener("change", update_from_perception);
// Call it once
update_from_perception(null);

// Marks a label/div as validated or invalidated
function mark_validity(label: HTMLLabelElement | HTMLElement | HTMLDivElement, validity: boolean) {
  if (validity) {
    label.classList.add("bg-success");
    label.classList.remove("bg-danger");
  }
  else {
    label.classList.add("bg-danger");
    label.classList.remove("bg-success");
  }
}

/// This function creates a callback which invalidates a label when a calculated value is modified manually
function create_invalidate_callback(label: HTMLLabelElement | HTMLDivElement) {
  return function(ev: Event) {
    mark_validity(label, false);
  }
}
function update_boon_total(ev: Event | null) {
  let total = parseInt(input_item_boon_chance.value) + parseInt(input_item_boon_chance_bonus.value);
  input_item_boon_chance_total.value = total.toString();
}
// Set callback on the boon chance field
let invalidate_boon_chance = create_invalidate_callback(input_item_boon_chance);
input_item_boon_chance.onchange = function(ev: Event) {
  invalidate_boon_chance(ev);
  update_boon_total(ev);
}
// Set callback on the boon bonus field
input_item_boon_chance_bonus.onchange = update_boon_total;

// Set callback on the bountiful bonus field
input_item_bountiful_bonus.onchange = create_invalidate_callback(input_item_bountiful_bonus);

// Stop default behavior of the form
form_search.onsubmit = async function(ev) {
  ev.preventDefault();
  return false;
}
// Add search functionality
button_search_modal.onclick = async function(event: MouseEvent) {
  // Reset the search box
  input_search.value = "";
  return true; 
}
button_search_execute.onclick = async function(event: MouseEvent) {
  // Disable default behavior
  event.preventDefault();
  // Clear out the existing results
  div_search_results.querySelectorAll("div.search-row").forEach(row => {
    row.parentNode!.removeChild(row)
  });
  // Perform the search
  let results = await search_gatherable(input_search.value);
  // Visualize the results
  for (let result of results) {
    console.log(result);
    // The row
    const div_result = document.createElement("div");
    div_result.classList.add("row");
    div_result.classList.add("search-row");
    div_result.addEventListener("click", click_search_result);
    // The icon
    const div_icon = document.createElement("div");
    div_icon.classList.add("col-sm-auto");
    const img_icon = document.createElement("img");
    div_icon.appendChild(img_icon);
    img_icon.src = result.icon;
    div_result.appendChild(div_icon);
    // The glvl component
    const div_glvl = document.createElement("div");
    div_glvl.classList.add("col-sm-auto");
    div_glvl.classList.add("search-glvl");
    div_glvl.innerText = result.gathering_level.toString();
    div_result.appendChild(div_glvl);
    // The name
    const div_name = document.createElement("div");
    div_name.classList.add("col-sm-auto");
    div_name.innerText = result.name;
    div_result.appendChild(div_name);
    // Finally. append the div to the list
    div_search_results.appendChild(div_result);
  }
  // Perform a search
  return false; 
}

async function click_search_result(event: Event) {
  // Find the item level
  let row = <HTMLDivElement> event.currentTarget!;
  let div_ilvl = <HTMLDivElement> row.querySelector(".search-glvl");
  let gathering_level = parseInt(div_ilvl.innerText);
  // Hide the modal
  let modal = Modal.getInstance(div_search_modal)!;
  await modal.hide();
  // Pass the value to the item level selector
  input_gathering_level.value = gathering_level.toString();
  await update_from_gathering_level(null);
  // Close the modal
  return false;
}
