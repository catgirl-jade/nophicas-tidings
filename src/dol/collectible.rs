// Copyright 2023 catgirl-jade
//
// This file is part of nophicas-tidings.
//
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.
use crate::dol::Node;
use crate::player::Player;
use fraction::Fraction as Frac;
use lazy_static::lazy_static;

// Based on the ItemLevel table
#[derive(Clone, Debug)]
pub struct Item {
    pub gathering: u16,
    pub perception: u16,
}
#[derive(Clone, Debug)]
pub struct State {
    // Set from initial parameters
    /// Metadata about the player
    player: Player,
    /// Metadata about the node being gathered from
    node: Node,
    /// Metadata about the item being gathered
    item: Item,
    // Set during gathering
    /// Remaining gp
    gp: u16,
    /// Remaining attempts
    remaining_attempts: u8,
    /// Collectibility
    collectibility: u16,
    /// Scrutiny bonus if activated
    scrutiny_bonus: Option<u16>,
    /// Whether collectors focus is activated
    collectors_focus: bool,
    /// Whether intuition is activated
    intuition: bool,
    /// Whether eureka moment is activated
    eureka_moment: bool,
    /// Collectibility of gathered items
    items: Vec<u16>,
    /// Actions taken so far
    actions_so_far: Vec<Action>,
    /// Future for this state, assuming the best action is taken
    next_state: Option<Box<Future>>,
}
impl State {
    pub fn new(player: &Player, item: &Item, node: &Node) -> Self {
        Self {
            player: player.clone(),
            item: item.clone(),
            node: node.clone(),
            gp: player.max_gp,
            remaining_attempts: node.max_attempts,
            collectibility: 0,
            scrutiny_bonus: None,
            collectors_focus: false,
            intuition: false,
            eureka_moment: false,
            items: Vec::new(),
            actions_so_far: Vec::new(),
            next_state: None,
        }
    }
    fn gathering_score(&self) -> u16 {
        Self::score(self.player.gathering, self.item.gathering)
    }
    fn perception_score(&self) -> u16 {
        Self::score(self.player.perception, self.item.perception)
    }
    fn score(player_value: u16, item_value: u16) -> u16 {
        ((100 * u32::from(player_value)) / u32::from(item_value))
            .min(100)
            .try_into()
            .unwrap()
    }
    fn action_score(score: u16) -> u16 {
        score.min(95)
    }
    fn rate_score(score: u16) -> u16 {
        score.min(100)
    }

    fn action(&mut self, action: &Action) -> Result<Future, GatherError> {
        // Node is dead
        if self.remaining_attempts == 0 {
            return Err(GatherError::NodeExhausted);
        }
        // Try to spend GP for the action
        self.spend_gp(&action)?;
        // Action specific stuff
        use Action::*;
        let future = match action {
            SolidReasonAgelessWords => {
                if self.remaining_attempts < self.node.max_attempts {
                    self.remaining_attempts += 1;
                } else {
                    return Err(GatherError::DurabilityOvercapped);
                }
                // Spawn 2 instances of self: one where eureka moment was triggered and one where
                // it wasnt
                let mut yes = self.clone();
                yes.eureka_moment = true;
                let mut no = self.clone();
                no.eureka_moment = false;
                Future::EurekaMoment { yes, no }
            }
            Collect => {
                // Add item with current collectibility to the list
                self.items.push(self.collectibility);
                // Consume a durability
                self.remaining_attempts -= 1;
                // Clear buffs
                self.clear_buffs();
                Future::Just(self.clone())
            }
            Scour => {
                // Intuition doesn't apply to base scour but it will still consume it
                let scour_value = self.scour_consume(false);
                self.add_collectibility(scour_value);
                Future::Just(self.clone())
            }
            Brazen => {
                // Intuition can apply here
                let probability = self.intuition_rate();
                let mut yes = self.clone();
                let yes = yes.brazen(true);
                let mut no = self.clone();
                let no = no.brazen(false);
                Future::Intuition {
                    probability,
                    yes: Future::Brazen { possibilities: yes }.into(),
                    no: Future::Brazen { possibilities: no }.into(),
                }
            }
            Meticulous => {
                // Intuition can apply here
                let scour_value = self.scour_consume(true);
                // 75% of scour value
                let metic_value = ((75 * u32::from(scour_value)) / 100)
                    .min(1000)
                    .try_into()
                    .unwrap();
                self.add_collectibility(metic_value);
                // Spawn 2 instances of self: one where meticulous was triggered and one where
                // it wasnt
                let yes = self.clone();
                let mut no = self.clone();
                no.remaining_attempts -= 1;
                Future::Meticulous {
                    probability: self.meticulous_rate(),
                    yes,
                    no,
                }
            }
            Scrutiny => {
                self.scrutiny_bonus = Some(self.scrutiny_value());
                Future::Just(self.clone())
            }
            CollectorsFocus => {
                self.collectors_focus = true;
                Future::Just(self.clone())
            }
            WiseToTheWorld => {
                if !self.eureka_moment {
                    return Err(GatherError::NoEurekaMoment);
                }
                if self.remaining_attempts < self.node.max_attempts {
                    self.remaining_attempts += 1;
                } else {
                    return Err(GatherError::DurabilityOvercapped);
                }
                Future::Just(self.clone())
            }
        };
        // Add the action to the list
        self.actions_so_far.push(*action);
        Ok(future)
    }
    fn spend_gp(&mut self, action: &Action) -> Result<(), GatherError> {
        let amount = action.gp();
        if amount > self.gp {
            Err(GatherError::NotEnoughGP)
        } else {
            self.gp -= amount;
            Ok(())
        }
    }
    fn clear_buffs(&mut self) {
        self.scrutiny_bonus = None;
        self.collectors_focus = false;
        self.intuition = false;
    }
    fn add_collectibility(&mut self, collectibility: u16) {
        self.collectibility = (self.collectibility + collectibility).min(1000)
    }
    /// Gets the value of a base scour without any bonuses
    fn base_scour_value(&self) -> u16 {
        let action_score = Self::action_score(self.gathering_score());
        const BASE_66: u16 = 150;
        // Scour_66
        if action_score <= 66 {
            BASE_66
        } else {
            let base_85 = BASE_66 + ((action_score - 66) * 40) / 19;
            // Scour_85
            if action_score <= 85 {
                base_85
            }
            // Scour_95
            else {
                base_85 + action_score - 85
            }
        }
    }
    /// Consumes bonuses and returns the baseline scour value
    fn scour_consume(&mut self, intuition_applies: bool) -> u16 {
        // Add the collectibility
        let mut scour_value = self.base_scour_value();
        // Add scrutiny if applicable
        if let Some(bonus) = self.scrutiny_bonus {
            scour_value += bonus;
        }
        // Add intuition if applicable
        let result = if self.intuition {
            scour_value + scour_value / 2
        } else {
            scour_value
        };
        // Clear buffs
        self.clear_buffs();
        result
    }
    fn brazen(&mut self, intuition: bool) -> Vec<State> {
        let scour_value = self.scour_consume(true);
        let possibilities = (50..=150)
            .map(|r| r * scour_value / 100)
            .take_while(|c| self.collectibility + c <= 1000)
            .map(|rate| {
                let mut state = self.clone();
                state.add_collectibility(multiply_by_percent(scour_value, rate));
                state
            })
            .collect();
        possibilities
    }
    fn scrutiny_value(&self) -> u16 {
        let action_score = Self::action_score(self.perception_score());
        const BASE_66: u16 = 90;
        // Srutiny_66
        if action_score <= 66 {
            BASE_66
        } else {
            let base_85 = BASE_66 + ((action_score - 66) * 25) / 19;
            // Srutiny_85
            if action_score <= 85 {
                base_85
            }
            // Srutiny_95
            else {
                base_85 + action_score - 85
            }
        }
    }
    fn intuition_rate(&self) -> Frac {
        let rate_score = Self::rate_score(self.perception_score());
        const BASE_66: u16 = 90;
        // Intuition_66
        let intuition_rate = if rate_score <= 66 {
            BASE_66
        } else {
            let base_85 = BASE_66 + ((rate_score - 66) * 10) / 19;
            // Intuition_85
            if rate_score <= 85 {
                base_85
            }
            // Intuition_95
            else {
                base_85 + rate_score - 85
            }
        };
        // Apply collectors focus
        let intuition_rate = if self.collectors_focus {
            (u32::from(intuition_rate * 175) / 100)
                .min(100)
                .try_into()
                .unwrap()
        } else {
            intuition_rate
        };
        Frac::new(intuition_rate, 100u16)
    }
    fn meticulous_rate(&self) -> Frac {
        let rate_score = Self::rate_score(self.gathering_score());
        const BASE_66: u16 = 10;
        // Meticulous_66
        let rate = if rate_score <= 66 {
            BASE_66
        } else {
            let base_85 = BASE_66 + ((rate_score - 66) * 5) / 19;
            // Meticulous_85
            if rate_score <= 85 {
                base_85
            }
            // Meticulous_95
            else {
                base_85 + rate_score - 85
            }
        };
        Frac::new(rate, 100u16)
    }
    pub fn calculate_future(&mut self) {
        dbg!(&self.actions_so_far);
        // The best we know of is our current state
        // Avoid copying it unless we have to
        let mut best_future = Future::Just(self.clone());
        let mut best_score = Frac::from(0);
        // Iterate over each potential action
        // Use the ascending list so we can terminate early
        for action in &*ACTIONS_GP_ASCENDING {
            let mut state = self.clone();
            match state.action(action) {
                Ok(ref mut possibilities) => {
                   state.next_state = Some(Box::from(possibilities.clone()));
//                   let value = state.value();
//                   if value > best_score {
//                        best_score = value;
//                        best_future = possibilities.clone();
//                   }
                }
                // If the node has no more durability, no other action will do anything
                Err(GatherError::NodeExhausted) |
                // Because we can guarantee that the list is sorted (ascending) by GP
                // If we run out of GP doing an action, the remaining actions will
                // also cost too much GP
                Err(GatherError::NotEnoughGP) => {
                    break;
                }
                Err(_) => {
                    // This action didn't work out, don't do anything further with that chain
                }
            }
        }
        self.next_state = Some(best_future.into());
    }

    fn value(&mut self) -> Frac {
        if let Some(ref mut future) = &mut self.next_state {
            future.value()
        } else {
            let s: u32 = self.items.iter().map(|i| u32::from(*i)).sum();
            Frac::from(s)
        }
    }
}
#[derive(Debug, Clone)]
enum Future {
    Just(State),
    Intuition {
        probability: Frac,
        yes: Box<Self>,
        no: Box<Self>,
    },
    EurekaMoment {
        yes: State,
        no: State,
    },
    Brazen {
        possibilities: Vec<State>,
    },
    Meticulous {
        probability: Frac,
        yes: State,
        no: State,
    },
}
impl Future {
    fn value(&mut self) -> Frac {
        use Future::*;
        match self {
            Just(state) => Frac::from(state.value()),
            Intuition {
                ref probability,
                yes,
                no,
            } => (probability * yes.value()) + ((-probability + 1) * no.value()),
            EurekaMoment { yes, no } => yes.value() / 2 + no.value() / 2,
            Brazen {
                ref mut possibilities,
            } => possibilities.iter_mut().map(|p| p.value()).sum::<Frac>() / possibilities.len(),
            Meticulous {
                ref probability,
                yes,
                no,
            } => (probability * yes.value()) + ((-probability + 1) * no.value()),
        }
    }
}

/// Action that can be used while gathering a collectible
#[derive(Copy, Clone, Debug)]
enum Action {
    SolidReasonAgelessWords,
    Collect,
    Scour,
    Brazen,
    Meticulous,
    Scrutiny,
    CollectorsFocus,
    WiseToTheWorld,
}
lazy_static! {
    static ref ACTIONS_GP_ASCENDING: [Action; 8] = {
        let mut actions = Action::ALL;
        actions.sort_by_key(|act| act.gp());
        actions
    };
}

impl Action {
    const ALL: [Action; 8] = [
        Action::SolidReasonAgelessWords,
        Action::Collect,
        Action::Scour,
        Action::Brazen,
        Action::Meticulous,
        Action::Scrutiny,
        Action::CollectorsFocus,
        Action::WiseToTheWorld,
    ];
    fn gp(&self) -> u16 {
        use Action::*;
        match self {
            Collect => 0,
            Scour => 0,
            Brazen => 0,
            Meticulous => 0,
            Scrutiny => 200,
            CollectorsFocus => 100,
            SolidReasonAgelessWords => 300,
            WiseToTheWorld => 0,
        }
    }
}

#[derive(Debug, thiserror::Error)]
enum GatherError {
    #[error("Node has been exhausted")]
    NodeExhausted,
    #[error("GP has been exhausted")]
    NotEnoughGP,
    #[error("SolidReason/AgelessWords wasted")]
    DurabilityOvercapped,
    #[error("Tried to use Wise to the World without a Eureka Moment proc")]
    NoEurekaMoment,
}

fn multiply_by_percent(value: u16, percent: u16) -> u16 {
    (u32::from(percent) * u32::from(value) / 100)
        .try_into()
        .unwrap()
}
