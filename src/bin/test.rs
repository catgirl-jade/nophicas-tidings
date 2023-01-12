// Copyright 2023 catgirl-jade
//
// This file is part of nophicas-tidings.
//
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.
use fraction::Fraction as Frac;
use nophicas_tidings::dol::{Item, Node};
use nophicas_tidings::player::Player;

fn main() {
    let player = Player {
        level: 90,
        gathering: 3712,
        perception: 3677,
        max_gp: 900,
    };
    let node = Node { max_attempts: 6 };
    let params = Item {
        success_chance: Frac::from(1),
        items_per_gather: 1,
        boon_chance: Frac::new(62u32, 100u32),
        boon_amount: 1,
        bountiful_bonus: 2,
    };
    dbg!(&player);
    dbg!(&node);
    dbg!(&params);
    let state = player.gather(&node, &params);
    let rotation = state.best_rotation();
    println!("Items: {:#.4}", rotation.items);
    for action in rotation.actions {
        println!("{}", action);
    }
}
