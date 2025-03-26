/// API URL for xivapi
const XIVAPI_BASE: string = "https://v2.xivapi.com/api";

/// Quick helper function to reduce duplication
export function make_icon_key(id: number): string {
  return `icon/action/${id}`;
}

/// Checks local cache for image urls before hitting XIVAPI
export async function find_icons(ids: Iterable<number>) {
  // Batch all the unknown ids into a single request
  let icon_responses = await Promise.all(
    [...ids].map(async (id) => (await (await fetch(`${XIVAPI_BASE}/sheet/Action/${id}?` + new URLSearchParams({fields: "Icon"}))).json()))
  );
  // Cache all the newly requested ids
  for (let response of icon_responses) {
    let icon_url = `${XIVAPI_BASE}/asset?` + new URLSearchParams({
      path: response.fields.Icon.path_hr1,
      format: "png",
    });
    let key = make_icon_key(response.row_id);
    localStorage.setItem(key, icon_url);
  }
}
export function get_icon_url(id: number) {
  let key = make_icon_key(id);
  if (key) {
    let path = localStorage.getItem(key);
    if (path) {
      return path;
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
    let resp = await fetch(`${XIVAPI_BASE}/sheet/ItemLevel/${gathering_level}`);
    let body = await resp.json();
    // Extract values
    gathering = body.fields.Gathering;
    perception = body.fields.Perception;
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
// Individual search result
export interface SearchResult {
  score: number,
  sheet: string,
  row_id: number,
  fields: SearchResultFields, 
}
// Fields for the search result
export interface SearchResultFields {
  Item: SearchResultFieldItem,
  GatheringItemLevel: SearchResultFieldGatheringItemLevel
}
export interface SearchResultFieldItem  {
  value: number,
  sheet: string,
  row_id: number,
  fields: SearchResultFieldItemFields,
}
export interface SearchResultFieldItemFields {
  Name: string,
  Icon: SearchResultFieldIcon,
  IsCollectable: boolean,
  ItemLevel: SearchResultFieldItemLevel,
}
// Icon field
export interface SearchResultFieldIcon {
  id: number,
  path: string,
  path_hr1: string,
}
// ItemLevel field
export interface SearchResultFieldItemLevel {
  value: number,
  sheet: string,
  row_id: number,
  fields: SearchResultFieldItemLevelFields,
}
// Subfields of ItemLevel
export interface SearchResultFieldItemLevelFields {
  Gathering: number,
  Perception: number
}

export interface SearchResultFieldGatheringItemLevel {
  value: number,
  sheet: string,
  row_id: number,
  fields: GatheringItemLevelFields
}
export interface GatheringItemLevelFields {
  GatheringItemLevel: number,
  Stars: number
}

/// Searches for gatherable items
export async function search_gatherable(query: string): Promise<Array<GatherableItem>> {
  let resp = await fetch(`${XIVAPI_BASE}/search?` + new URLSearchParams({
    query: `Item.Name~"${query}"`,
    sheets: "GatheringItem",
    fields: "Item.Name,Item.ItemLevel.Gathering,Item.ItemLevel.Perception,Item.Icon,Item.IsCollectable,GatheringItemLevel",
  }));
  let body = await resp.json();
  console.log(body);
  return await Promise.all(body.results.filter((result: SearchResult) => !result.fields.Item.fields.IsCollectable).map(async (result: SearchResult) => <GatherableItem>({
    name: result.fields.Item.fields.Name,
    gathering_level: result.fields.GatheringItemLevel.row_id,
    icon: `${XIVAPI_BASE}/asset?` + new URLSearchParams({
      path: result.fields.Item.fields.Icon.path_hr1,
      format: "png",
    }),
  })));
}
