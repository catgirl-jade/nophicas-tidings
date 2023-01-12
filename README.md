# Nophica's Tidings

Gathering optimizer for FFXIV.

Tries every possible rotation (except guaranteed-bad decisions) and reports the rotation with the highest average yield. Uses WebAssembly and Rust for *blazing fast* speed.

## THINGS THAT DONT WORK YET
* BYH2 chance calculation (depends on item level, perception I think)
* Node success chance calculation (depends on item level, gathering I think)

## Usage:
Simply fill in fields and press "Simulate" to produce the optimal rotation.
* Fields highlighted in green imply that they have been calculated correctly based on their dependent values.
* Fields highlighted in red have been modified, and may not correspond to their calculated values, but will still produce correct results.

## Notes:
* This uses <a href="https://xivapi.com">XIVAPI</a> for icons and data sheet values. XIVAPI requests are all cached in localStorage to avoid excessive requests. Caching of icons is managed by your browser.
