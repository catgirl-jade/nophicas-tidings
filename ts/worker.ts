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
import * as nophicas_tidings from "../pkg";

// TODO: Port this fully to rust
console.log("Worker initialized");

/// Processes data
onmessage = (e: MessageEvent) => {
  console.debug("Got request from main thread");
  let data = <WorkerData> e.data;
  let result = nophicas_tidings.generate_rotation(
    data.player_level,
    data.player_gp,
    data.node_durability,
    data.item_success_chance,
    data.item_gather_amount,
    data.item_boon_chance,
    data.item_bountiful_bonus,
  );
  postMessage(result);
}
