/// API URL for xivapi
const XIVAPI_BASE: string = "https://xivapi.com";

/// Quick helper function to reduce duplication
export function make_icon_key(id: number): string {
  return `icon/action/${id}`;
}

/// Checks local cache for image urls before hitting XIVAPI
export async function find_icons(ids: Iterable<number>) {
  let unknown_ids = new Array<number>();
  for (let id of ids) {
    let key = make_icon_key(id); 
    let path = localStorage.getItem(key);
    if (!path) {
      unknown_ids.push(id);
    }
  }
  let id_string = unknown_ids.map((id) => id.toString()).join(",");
  if (unknown_ids.length > 0) {
    // Batch all the unknown ids into a single request
    let resp = await fetch(`${XIVAPI_BASE}/action?` + new URLSearchParams({ids: id_string}));
    let body = await resp.json();
    // Cache all the newly requested ids
    for (let result of body.Results) {
      let key = make_icon_key(result.ID);
      localStorage.setItem(key ,result.Icon);
    }
  }
}
export function get_icon_url(id: number) {
  let key = make_icon_key(id);
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
export async function get_item_base_scores(gathering_level: number): Promise<BaseScores> {
  let key = `glvl/${gathering_level}`;
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
    let resp = await fetch(`${XIVAPI_BASE}/ItemLevel/${gathering_level}`);
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
  gathering_level: number,
  icon: string
}
export interface SearchResult {
  Name: string,
  GameContentLinks: SearchResultGameContentLinks,
  Icon: string,
}
export interface SearchResultGameContentLinks {
  GatheringItem: GameContentLinksGatheringItem
}
export interface GameContentLinksGatheringItem {
  Item: Array<number>
}

/// Searches for gatherable items
export async function search_gatherable(query: string): Promise<Array<GatherableItem>> {
  let resp = await fetch("https://xivapi.com/search", {
      "method": "POST",
      "body":
      JSON.stringify({
        indexes: "Item,GatheringItem",
        columns: "Name,Icon,GameContentLinks.GatheringItem",
        body: {
          query: {
            bool: {
              must: [
                {
                  wildcard: {
                    NameCombined_en: `*${query}*`
                  }
                }
              ],
              filter: [
                {
                  exists: {
                    field: "GameContentLinks.GatheringItem"
                  }
                },
                {
                  term: {
                    IsCollectable: 0 
                  }
                }
              ]
            }
          },
          from: 0,
          size: 100
        }
      })
  });
  let body = await resp.json();
  return await Promise.all(body.Results.map(async (result: SearchResult) => <GatherableItem>({
    name: result.Name,
    gathering_level: await get_item_gathering_level(result.GameContentLinks.GatheringItem.Item[0]),
    icon: `${XIVAPI_BASE}${result.Icon}`
  })));
}

export async function get_item_gathering_level(gathering_item_id: number): Promise<number> {
  let key = `glvl_for/${gathering_item_id}`;
  let cached = localStorage.getItem(key);
  let glvl = null;
  if (cached) {
    cached = cached!;
    glvl = parseInt(cached);
  }
  else {
    // Request info from xivapi 
    let resp = await fetch(`${XIVAPI_BASE}/GatheringItem/${gathering_item_id}`);
    let body = await resp.json();
    // Extract values
    glvl = body.GatheringItemLevelTargetID;
    // Cache them
    let entry = `${glvl}`;
    localStorage.setItem(key, entry);
  }
  return glvl; 
}
