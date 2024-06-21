// Copyright 2023 catgirl-jade
//
// This file is part of nophicas-tidings.
//
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.
pub mod collectible;

use crate::player::Player;
use fraction::Fraction as Frac;
use lazy_static::lazy_static;
use serde::Serialize;
use std::fmt;

#[derive(Clone, Debug, PartialEq)]
pub struct Item {
    pub success_chance: Frac,
    pub items_per_gather: u8,
    pub boon_chance: Frac,
    pub boon_amount: u8,
    pub bountiful_bonus: u8,
}
impl Default for Item {
    fn default() -> Self {
        Self {
            success_chance: Frac::from(1),
            items_per_gather: 1,
            boon_chance: Frac::from(1),
            boon_amount: 1,
            bountiful_bonus: 3,
        }
    }
}

#[derive(Clone, Debug)]
pub struct Node {
    pub max_attempts: u8,
}

#[derive(Clone, Debug)]
pub struct GatherState {
    // Base parameters going into the node
    // Player params
    player: Player,
    /// Node parameters
    item: Item,
    // Item parameters
    node: Node,
    // Parameters during gathering
    /// Remaining gp
    gp: u16,
    /// Success chance
    success_chance: Frac,
    /// How many previous hits were based on eureka momentseureka moments
    eureka_hits: u8,
    /// Probability the chain even gets this far
    depends_on_eureka_hits: u8,
    /// How many attempts remaining
    remaining_attempts: u8,
    /// Bonus from blessed/kings
    blessed_king_bonus: u8,
    /// Whether sharp vision/field mastery was used
    sharp_vision_field_mastery_used: [bool; 3],
    /// Whether gift 1 and 2 were used
    gift_used: [bool; 2],
    /// Whether clear vision/flora mastery is active
    clear_vision_flora_mastery_active: bool,
    /// Whether tidings was used
    tidings: bool,
    /// Whether bountiful X was used
    /// Fractional due to WTTW
    bountiful_chance: Frac,
    /// Whether wise to the world may be available
    eureka_moment: bool,
    /// Whether wise to the world was triggered
    /// If so, the next gather happens at 50% probability
    wise_to_the_world: bool,
    /// Amount gathered so far
    amount_gathered: Frac,
    /// Actions so far
    actions_so_far: Vec<ActionLog>,
}
impl GatherState {
    pub fn new(player: &Player, node: &Node, item: &Item) -> Self {
        Self {
            player: player.clone(),
            item: item.clone(),
            gp: player.max_gp,
            success_chance: item.success_chance,
            eureka_hits: 0,
            depends_on_eureka_hits: 0,
            remaining_attempts: node.max_attempts,
            node: node.clone(),
            blessed_king_bonus: 0,
            sharp_vision_field_mastery_used: [false; 3],
            gift_used: [false; 2],
            clear_vision_flora_mastery_active: false,
            tidings: false,
            bountiful_chance: Frac::from(0),
            eureka_moment: false,
            wise_to_the_world: false,
            amount_gathered: Frac::from(0),
            actions_so_far: Vec::new(),
        }
    }
    fn spend_gp(&mut self, action: &GatherAction) -> Result<(), GatherError> {
        let amount = action.gp();
        if amount > self.gp {
            let mut prob = Frac::from(1);
            for i in 1..=self.eureka_hits {
                prob /= 2;
                let gp_with_eureka_hits =
                    self.gp + u16::from(i) * u16::from(self.player.gp_per_gather());
                if gp_with_eureka_hits > amount {
                    // Spend the GP as if the eureka hits happened
                    self.gp = gp_with_eureka_hits - amount;
                    // Spend the eureka hit counter
                    self.eureka_hits -= i;
                    // Use the gather probability to say that all future actions are probabilistic
                    // on these eureka hit gp
                    self.depends_on_eureka_hits = i;
                    // Continue as if we have that much GP
                    return Ok(());
                }
            }
            Err(GatherError::NotEnoughGP)
        } else {
            self.gp -= amount;
            Ok(())
        }
    }
    fn check_level(&mut self, action: &GatherAction) -> Result<(), GatherError> {
        if self.player.level < action.required_level() {
            Err(GatherError::NotUnlocked)
        } else {
            Ok(())
        }
    }
    fn action(&mut self, mut action: GatherAction) -> Result<(), GatherError> {
        // Node is dead
        if self.remaining_attempts == 0 {
            return Err(GatherError::NodeExhausted);
        }
        // Keeps track of how many eureka moments must proc for this action to happen
        let mut depends_on = self.depends_on_eureka_hits;
        // Perform the action
        use GatherAction::*;
        // Every action spends GP
        self.spend_gp(&action)?;
        // Every action has a required level
        self.check_level(&action)?;
        // Perform some checks if the action is a buff
        if matches!(
            action,
            SharpVisionFieldMastery(_) | Gift(_) | BlessedKing(_) | Tidings
        ) && self.amount_gathered > Frac::from(0)
        {
            return Err(GatherError::BuffUsedAfterGather);
        }
        // Perform action specific tasks
        match &mut action {
            SharpVisionFieldMastery(rank) => self.sharp_vision_field_mastery(&*rank)?,
            Gift(rank) => self.gift(&*rank)?,
            ClearVisionFloraMastery => self.clear_vision_flora_mastery()?,
            BlessedKing(rank) => self.blessed_king(&*rank)?,
            SolidReasonAgelessWords => self.solid_reason_ageless_words()?,
            Bountiful => self.bountiful()?,
            Tidings => self.tidings()?,
            WiseToTheWorld => {
                if !self.eureka_moment {
                    return Err(GatherError::NoEurekaMoment);
                }
                // Only give the benefit if we're not wasting an attempt
                if self.remaining_attempts < self.node.max_attempts {
                    // Mark that wise to the world was used
                    self.wise_to_the_world = true;
                }
                // Consume the potential eureka moment
                self.eureka_moment = false;
            }
            Gather { ref mut amount } => {
                // Calculate success chance if clear vision is applied
                let success_chance = if self.clear_vision_flora_mastery_active {
                    // Consume CVFM
                    self.clear_vision_flora_mastery_active = false;
                    (self.success_chance + Frac::new(15u64, 100u64)).max(Frac::from(1u64))
                } else {
                    self.success_chance
                };
                // This is the chance the gather happens at all (if wise to the world was used,
                // this gather is in limbo)
                let mut base_gather_chance = if self.wise_to_the_world {
                    success_chance / 2
                } else {
                    success_chance
                };
                // Weight the branch according to how many additional eureka hits are required to
                // even be here
                // TODO: look at this
                for _ in 1..=depends_on {
                    base_gather_chance /= 2;
                }
                // Gather the base amount
                let mut amount_gathered = base_gather_chance
                    * u128::from(self.item.items_per_gather + self.blessed_king_bonus);
                // Gather the bountiful amount
                // If wttw is active, we are claiming half of the reward (because there's a 50%
                // chance it applies on this gather) This 50% is factored in from
                // base_gather_chance
                amount_gathered += base_gather_chance
                    * self.bountiful_chance
                    * u128::from(self.item.bountiful_bonus);
                // If gather occurs again, we can guarantee the bonus gets applied in full
                // Thus, we set the bountiful chance to be 1/2, so the next gather can
                // claim the other half
                if self.wise_to_the_world && self.bountiful_chance != Frac::from(0) {
                    self.bountiful_chance = Frac::new(1u64, 2u64);
                } else {
                    // If this was not a wise to the world iteration, we always claim the bonus
                    // completely
                    self.bountiful_chance = Frac::from(0);
                }
                // Gatherers boon
                amount_gathered +=
                    base_gather_chance * self.item.boon_chance * u128::from(self.item.boon_amount);
                // Add the amount into the total
                self.amount_gathered += amount_gathered;
                *amount = amount_gathered;
                // Resolve wise to the world now that we've performed a gather
                if self.wise_to_the_world {
                    self.wise_to_the_world = false;
                    self.eureka_hits += 1;
                    depends_on += 1;
                } else {
                    // Add gp from the whack
                    self.gp =
                        (self.gp + u16::from(self.player.gp_per_gather())).min(self.player.max_gp);
                    // Wise to the world doesn't count as an "attempt" but everything else does
                    self.remaining_attempts -= 1;
                }
            }
        };
        self.actions_so_far.push(ActionLog { action, depends_on });
        Ok(())
    }
    /// rank=false for gift 0, rank=true for gift 1
    /// TODO: enum
    fn sharp_vision_field_mastery(&mut self, rank: &SVFMRank) -> Result<(), GatherError> {
        if self.success_chance == Frac::from(1) {
            return Err(GatherError::SVFMWasted);
        }
        let idx = match rank {
            SVFMRank::I => 0,
            SVFMRank::II => 1,
            SVFMRank::III => 2,
        };
        if self.sharp_vision_field_mastery_used[idx] {
            return Err(GatherError::SVFMAlreadyUsed(*rank));
        }
        if self.success_chance == Frac::from(0) {
            return Err(GatherError::SVFMCVFMUsedAtZero);
        }
        if let Some(prev_rank) = rank.previous_tier() {
            if self.success_chance + prev_rank.gather_chance_bonus() >= Frac::from(1) {
                return Err(GatherError::SVFMWasted);
            }
        }
        // Cap the chance at 100%
        self.success_chance = (self.success_chance + rank.gather_chance_bonus()).min(Frac::from(1));
        // Mark it used
        self.sharp_vision_field_mastery_used[idx] = true;
        Ok(())
    }
    /// rank=false for gift 0, rank=true for gift 1
    /// TODO: enum
    fn gift(&mut self, rank: &GiftRank) -> Result<(), GatherError> {
        // Used to check if gift was already used
        let idx = match rank {
            GiftRank::I => 0,
            GiftRank::II => 1,
        };
        let chance = rank.boon_chance_bonus();
        // Don't use the buff
        if self.gift_used[idx] {
            Err(GatherError::BuffAlreadyApplied)
        } else if self.item.boon_chance == Frac::from(0) {
            Err(GatherError::BoonChanceZero)
        } else {
            if self.item.boon_chance == Frac::from(1) {
                Err(GatherError::BoonAlreadyMax)
            } else {
                self.item.boon_chance = self.item.boon_chance + chance;
                if self.item.boon_chance > Frac::from(1) {
                    self.item.boon_chance = Frac::from(1);
                }
                self.gift_used[idx] = true;
                Ok(())
            }
        }
    }
    fn clear_vision_flora_mastery(&mut self) -> Result<(), GatherError> {
        // If already used, fail
        if self.clear_vision_flora_mastery_active {
            return Err(GatherError::CVFMWasted);
        }
        // If success chance is 0, this does not apply
        if self.success_chance == Frac::from(0u64) {
            return Err(GatherError::SVFMCVFMUsedAtZero);
        }
        // If success chance is 1, this is completely useless
        if self.success_chance >= Frac::from(1u64) {
            return Err(GatherError::CVFMUsedAtMax);
        }
        self.clear_vision_flora_mastery_active = true;
        Ok(())
    }
    fn bountiful(&mut self) -> Result<(), GatherError> {
        if self.bountiful_chance > Frac::from(0) {
            return Err(GatherError::BuffAlreadyApplied);
        }
        self.bountiful_chance = Frac::from(1);
        Ok(())
    }
    fn tidings(&mut self) -> Result<(), GatherError> {
        if self.tidings {
            return Err(GatherError::BuffAlreadyApplied);
        }
        self.item.boon_amount += 1;
        self.tidings = true;
        Ok(())
    }
    fn solid_reason_ageless_words(&mut self) -> Result<(), GatherError> {
        // Add the attempt (Don't allow wasting)
        if self.remaining_attempts < self.node.max_attempts {
            self.remaining_attempts += 1;
        } else {
            return Err(GatherError::DurabilityOvercapped);
        }
        // Handle eureka moments
        if self.player.level >= 90 {
            // If we have a eureka moment already, we must use
            // wise to the world, or risk wasting it
            if self.eureka_moment {
                self.action(GatherAction::WiseToTheWorld)?;
            }
            // Grant a potential eureka moment
            self.eureka_moment = true;
        }
        Ok(())
    }
    fn blessed_king(&mut self, rank: &BlessedKingRank) -> Result<(), GatherError> {
        // Calculate bonus
        let bonus = rank.item_bonus();
        if self.blessed_king_bonus > 0 {
            return Err(GatherError::BuffAlreadyApplied);
        } else {
            self.blessed_king_bonus = bonus;
        }
        Ok(())
    }
    pub fn best_rotation(&self) -> Rotation {
        // The best we know of is our current state
        // Avoid copying it unless we have to
        let mut best_sequence = None;
        let mut best_score = self.amount_gathered;
        for action in &*ACTIONS_GP_ASCENDING {
            let mut state = self.clone();
            match state.action(*action) {
                Ok(()) => {
                    // Check if the new state is better
                    //dbg!(&state.amount_gathered);
                    if state.amount_gathered > best_score {
                        best_score = state.amount_gathered;
                        best_sequence = Some(state.actions_so_far.clone());
                    };
                    // Check if any substate of the new state is better
                    let Rotation {
                        actions: best_subsequence,
                        items: best_sub_score,
                    } = state.best_rotation();
                    //dbg!(&best_subsequence_score);
                    if best_sub_score > best_score {
                        best_sequence = Some(best_subsequence);
                        best_score = best_sub_score;
                    }
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
        let best_sequence = best_sequence.unwrap_or(self.actions_so_far.clone());
        Rotation {
            actions: best_sequence,
            items: best_score,
        }
    }
}
#[derive(Clone, Debug, PartialEq)]
pub struct Rotation {
    pub items: Frac,
    pub actions: Vec<ActionLog>,
}

impl Serialize for Rotation {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        // Serialize as a map
        let mut obj = serializer.serialize_struct("", 2)?;
        // Convert items using our preferred format
        let amount_str = frac_to_string(self.items);
        obj.serialize_field("items", &amount_str)?;
        // serialize the actions using its method
        obj.serialize_field("actions", &self.actions)?;
        // Return the resulting obj
        obj.end()
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Serialize)]
pub struct ActionLog {
    action: GatherAction,
    depends_on: u8,
}
#[derive(Clone, Copy, Debug, PartialEq)]
enum GatherAction {
    SharpVisionFieldMastery(SVFMRank),
    Gift(GiftRank),
    ClearVisionFloraMastery,
    Bountiful,
    SolidReasonAgelessWords,
    BlessedKing(BlessedKingRank),
    Tidings,
    WiseToTheWorld,
    Gather { amount: Frac },
}
impl fmt::Display for GatherAction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        use GatherAction::*;
        match self {
            SharpVisionFieldMastery(rank) => write!(f, "Sharp Vision/Field Mastery {rank}"),
            Gift(rank) => write!(f, "Pioneer/Mountaineer's Gift {rank}"),
            ClearVisionFloraMastery => f.write_str("Flora Mastery/Clear Vision"),
            Bountiful => f.write_str("Bountiful Harvest/Yield I/II"),
            SolidReasonAgelessWords => f.write_str("Ageless Words/Solid Reason"),
            BlessedKing(rank) => write!(f, "King's Yield/Blessed Harvest {rank}"),
            Tidings => f.write_str("Nald'thal/Nophica's Tidings"),
            WiseToTheWorld => f.write_str("Wise to the World"),
            Gather { amount } => {
                let amount_str = frac_to_string(*amount);
                if f.alternate() {
                    write!(f, "Gather {} items", amount_str)
                } else {
                    f.write_str("Gather")
                }
            }
        }
    }
}

impl Serialize for GatherAction {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        // Start the map, gathers get an extra field
        let mut obj = serializer.serialize_struct(
            "",
            if matches!(self, GatherAction::Gather { .. }) {
                4
            } else {
                3
            },
        )?;
        // Action ids
        obj.serialize_field("id_min", &self.btn_icon())?;
        obj.serialize_field("id_btn", &self.min_icon())?;
        // Spell name to make things easier
        obj.serialize_field("name", &self.to_string())?;
        // Extra field
        if let GatherAction::Gather { amount } = self {
            let amount_str = frac_to_string(*amount);
            obj.serialize_field("amount", &amount_str)?;
        }
        // Return the resulting obj
        obj.end()
    }
}
#[derive(Clone, Copy, Debug, PartialEq)]
#[allow(clippy::upper_case_acronyms)]
enum SVFMRank {
    I,
    II,
    III,
}
impl fmt::Display for SVFMRank {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        use SVFMRank::*;
        f.write_str(match self {
            I => "I",
            II => "II",
            III => "III",
        })
    }
}
impl SVFMRank {
    fn gp(&self) -> u16 {
        use SVFMRank::*;
        match self {
            I => 50,
            II => 100,
            III => 250,
        }
    }
    fn previous_tier(&self) -> Option<Self> {
        use SVFMRank::*;
        match self {
            I => None,
            II => Some(I),
            III => Some(II),
        }
    }
    fn required_level(&self) -> u8 {
        use SVFMRank::*;
        match self {
            I => 4,
            II => 5,
            III => 10,
        }
    }
    fn gather_chance_bonus(&self) -> Frac {
        use SVFMRank::*;
        match self {
            // 5%
            I => Frac::new(1u8, 20u8),
            // 15%
            II => Frac::new(3u8, 20u8),
            // 50%
            III => Frac::new(1u8, 2u8),
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq)]
enum GiftRank {
    I,
    II,
}
impl fmt::Display for GiftRank {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        use GiftRank::*;
        f.write_str(match self {
            I => "I",
            II => "II",
        })
    }
}
impl GiftRank {
    fn gp(&self) -> u16 {
        use GiftRank::*;
        match self {
            I => 50,
            II => 100,
        }
    }
    fn boon_chance_bonus(&self) -> Frac {
        use GiftRank::*;
        match self {
            // 10%
            I => Frac::new(1u8, 10u8),
            // 30%
            II => Frac::new(3u8, 10u8),
        }
    }
    fn required_level(&self) -> u8 {
        use GiftRank::*;
        match self {
            I => 15,
            II => 50,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq)]
enum BlessedKingRank {
    I,
    II,
}
impl fmt::Display for BlessedKingRank {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        use BlessedKingRank::*;
        f.write_str(match self {
            I => "I",
            II => "II",
        })
    }
}
impl BlessedKingRank {
    fn gp(&self) -> u16 {
        use BlessedKingRank::*;
        match self {
            I => 400,
            II => 500,
        }
    }
    fn item_bonus(&self) -> u8 {
        use BlessedKingRank::*;
        match self {
            I => 1,
            II => 2,
        }
    }
    fn required_level(&self) -> u8 {
        use BlessedKingRank::*;
        match self {
            I => 30,
            II => 40,
        }
    }
}

impl GatherAction {
    const ALL: [Self; 13] = [
        GatherAction::SharpVisionFieldMastery(SVFMRank::I),
        GatherAction::SharpVisionFieldMastery(SVFMRank::II),
        GatherAction::SharpVisionFieldMastery(SVFMRank::III),
        GatherAction::Gift(GiftRank::I),
        GatherAction::Gift(GiftRank::II),
        GatherAction::ClearVisionFloraMastery,
        GatherAction::Bountiful,
        GatherAction::SolidReasonAgelessWords,
        GatherAction::BlessedKing(BlessedKingRank::I),
        GatherAction::BlessedKing(BlessedKingRank::II),
        GatherAction::Tidings,
        GatherAction::WiseToTheWorld,
        // These values arent used here, just there to be filled in later
        GatherAction::Gather {
            amount: Frac::new_raw(0u64, 1u64),
        },
    ];
    fn gp(&self) -> u16 {
        use GatherAction::*;
        match self {
            SharpVisionFieldMastery(rank) => rank.gp(),
            Gift(rank) => rank.gp(),
            ClearVisionFloraMastery => 50,
            Bountiful => 100,
            SolidReasonAgelessWords => 300,
            BlessedKing(rank) => rank.gp(),
            Tidings => 200,
            WiseToTheWorld => 0,
            Gather { .. } => 0,
        }
    }
    fn min_icon(&self) -> u32 {
        use GatherAction::*;
        match self {
            SharpVisionFieldMastery(SVFMRank::I) => 235,
            SharpVisionFieldMastery(SVFMRank::II) => 237,
            SharpVisionFieldMastery(SVFMRank::III) => 295,
            ClearVisionFloraMastery => 4072,
            Gift(GiftRank::I) => 21177,
            Gift(GiftRank::II) => 25589,
            Bountiful => 272, // Also 4073 for I,
            SolidReasonAgelessWords => 232,
            BlessedKing(BlessedKingRank::I) => 239,
            BlessedKing(BlessedKingRank::II) => 241,
            Tidings => 21203,
            WiseToTheWorld => 26521,
            Gather { .. } => 240,
        }
    }
    fn btn_icon(&self) -> u32 {
        use GatherAction::*;
        match self {
            SharpVisionFieldMastery(SVFMRank::I) => 218,
            SharpVisionFieldMastery(SVFMRank::II) => 220,
            SharpVisionFieldMastery(SVFMRank::III) => 294,
            ClearVisionFloraMastery => 4086,
            Gift(GiftRank::I) => 21178,
            Gift(GiftRank::II) => 25590,
            Bountiful => 272, // Also 4087 for I,
            SolidReasonAgelessWords => 215,
            BlessedKing(BlessedKingRank::I) => 222,
            BlessedKing(BlessedKingRank::II) => 224,
            Tidings => 21204,
            WiseToTheWorld => 26522,
            Gather { .. } => 815,
        }
    }
    fn required_level(&self) -> u8 {
        use GatherAction::*;
        match self {
            Gather { .. } => 1,
            SharpVisionFieldMastery(rank) => rank.required_level(),
            Gift(rank) => rank.required_level(),
            ClearVisionFloraMastery => 23,
            Bountiful => 24,
            SolidReasonAgelessWords => 25,
            BlessedKing(rank) => rank.required_level(),
            Tidings => 81,
            WiseToTheWorld => 90,
        }
    }
}
lazy_static! {
    static ref ACTIONS_GP_ASCENDING: [GatherAction; 13] = {
        let mut actions = GatherAction::ALL;
        actions.sort_by_key(|act| act.gp());
        actions
    };
}
impl fmt::Display for ActionLog {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.action)?;
        if self.depends_on != 0 {
            write!(f, " (depends on {} Eureka Moments)", self.depends_on)?;
        }
        Ok(())
    }
}
#[derive(Debug, thiserror::Error)]
enum GatherError {
    #[error("Node has been exhausted")]
    NodeExhausted,
    #[error("GP has been exhausted")]
    NotEnoughGP,
    #[error("Not high enough level, or ability has not been unlocked")]
    NotUnlocked,
    #[error("Used buff after a gather, which means a gather did not benefit from the buff")]
    BuffUsedAfterGather,
    #[error("Tried to use Wise to the World without a Eureka Moment proc")]
    NoEurekaMoment,
    #[error("Buff has already been applied or upgrading it is a waste of GP")]
    BuffAlreadyApplied,
    #[error("Gift cannot be applied if the initial boon chance is zero")]
    BoonChanceZero,
    #[error("Gift does nothing if boon is already max")]
    BoonAlreadyMax,
    #[error("SolidReason/AgelessWords wasted")]
    DurabilityOvercapped,
    #[error("Sharp Vision/Field Mastery used at 100% or when a lower rank would have sufficed")]
    SVFMWasted,
    #[error("Sharp Vision/Field Mastery {0} used when it has already been applied")]
    SVFMAlreadyUsed(SVFMRank),
    #[error("Sharp Vision/Field Mastery/Clear Vision/Flora Mastery used when chance is zero, does nothing")]
    SVFMCVFMUsedAtZero,
    #[error("Clear Vision/Flora Mastery used at max gather chance")]
    CVFMUsedAtMax,
    #[error("Clear Vision/Flora Mastery wasted used when it has already been applied")]
    CVFMWasted,
}
fn frac_to_string(f: Frac) -> String {
    fraction::division::divide_to_string(*f.numer().unwrap(), *f.denom().unwrap(), 8, false)
        .unwrap()
}
