/// API URL for xivapi
const XIVAPI_BASE: string = "https://xivapi.com";

/// Quick helper function to reduce duplication
export function make_icon_key(t: string, id: number): string {
  return `icon/${t}/${id}`;
}

/// Checks local cache for image urls before hitting XIVAPI
export async function find_icons(ty: string, ids: Iterable<number>) {
  let unknown_ids = new Array<number>();
  for (let id of ids) {
    let key = make_icon_key(ty, id); 
    let path = localStorage.getItem(key);
    if (!path) {
      unknown_ids.push(id);
    }
  }
  let id_string = unknown_ids.map((id) => id.toString()).join(",");
  if (unknown_ids.length > 0) {
    // Batch all the unknown ids into a single request
    let resp = await fetch(`${XIVAPI_BASE}/${ty}?` + new URLSearchParams({ids: id_string}));
    let body = await resp.json();
    // Cache all the newly requested ids
    for (let result of body.Results) {
      let key = make_icon_key(ty, result.ID);
      localStorage.setItem(key, result.Icon);
    }
  }
}
export function get_icon_url(type: string, id: number) {
  let key = make_icon_key(type, id);
  if (key) {
    let path = localStorage.getItem(key);
    if (path) {
      return `${XIVAPI_BASE}${path}`;
    }
  }
  return null;
}

export interface BaseScores {
  gathering: number,
  perception: number,
}

/// Requests gathering and perception stats for a given item level
export async function get_item_base_scores(item_level: number): Promise<BaseScores> {
  let key = `ilvl/${item_level}`;
  let cached = localStorage.getItem(key);
  let gathering = null;
  let perception = null;
  if (cached) {
    cached = cached!;
    let data = cached.split("/");
    gathering = parseInt(data[0]);
    perception = parseInt(data[1]);
  }
  else {
    // Request info from xivapi 
    let resp = await fetch(`${XIVAPI_BASE}/ItemLevel/${item_level}`);
    let body = await resp.json();
    // Extract values
    gathering = body.Gathering;
    perception = body.Perception;
    // Cache them
    let entry = `${gathering}/${perception}`;
    localStorage.setItem(key, entry);
  }
  return { gathering, perception };
}

export interface GatherableItem {
  name: string,
  item_level: number
}
/// Searches for gatherable items
export async function search_gatherable(query: string): Promise<Array<GatherableItem>> {
  return new Array();
}
