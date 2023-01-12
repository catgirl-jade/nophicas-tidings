// Copyright 2023 catgirl-jade
//
// This file is part of nophicas-tidings.
//
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.
pub mod dol;
pub mod player;

use crate::dol::{Item, Node};
use crate::player::Player;
use fraction::Fraction as Frac;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init() {
    #[cfg(feature = "console_panic")]
    {
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
    }
}

#[wasm_bindgen]
pub fn generate_rotation(
    level: u8,
    max_gp: u16,
    node_durability: u8,
    item_success_chance: u8,
    item_gather_amount: u8,
    boon_chance: u8,
    bountiful_bonus: u8,
) -> JsValue {
    // Initialize player settings
    let player = Player {
        level,
        gathering: 0,
        perception: 0,
        max_gp,
    };
    // Initialize node settings
    let node = Node {
        max_attempts: node_durability,
    };
    // Initialize item settings
    let params = Item {
        success_chance: Frac::new(item_success_chance, 100u8),
        items_per_gather: item_gather_amount,
        boon_chance: Frac::new(boon_chance, 100u8),
        boon_amount: 1,
        bountiful_bonus,
    };
    let state = player.gather(&node, &params);
    let rotation = state.best_rotation();
    serde_wasm_bindgen::to_value(&rotation).unwrap()
}
