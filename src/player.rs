// Copyright 2023 catgirl-jade
//
// This file is part of nophicas-tidings.
//
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.

use crate::dol::collectible::{Item as CollectibleItem, State as CollectibleState};
use crate::dol::{self, GatherState, Node};

#[derive(Clone, Debug, PartialEq)]
pub struct Player {
    pub level: u8,
    pub gathering: u16,
    pub perception: u16,
    pub max_gp: u16,
}

impl Default for Player {
    fn default() -> Self {
        Self {
            level: 90,
            gathering: 3712,
            perception: 3677,
            max_gp: 900,
        }
    }
}
impl Player {
    pub fn gather(&self, node: &Node, item: &dol::Item) -> GatherState {
        GatherState::new(self, node, item)
    }
    pub fn gather_collectible(&self, node: &Node, item: &CollectibleItem) -> CollectibleState {
        CollectibleState::new(self, item, node)
    }
    pub fn gp_per_gather(&self) -> u8 {
        match self.level {
            80.. => 6,
            _ => 5,
        }
    }
}
