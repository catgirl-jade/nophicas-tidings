use nophicas_tidings::dol::collectible::Item;
use nophicas_tidings::dol::Node;
use nophicas_tidings::player::Player;

fn main() {
    let player = Player {
        level: 90,
        gathering: 4000,
        perception: 4000,
        max_gp: 900,
    };
    let node = Node { max_attempts: 6 };
    let item = Item {
        gathering: 2800,
        perception: 2800,
    };
    let mut state = player.gather_collectible(&node, &item);
    let best = state.calculate_future();
}
