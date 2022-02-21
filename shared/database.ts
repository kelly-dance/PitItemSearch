import {
  Bson,
  MongoClient,
} from "https://deno.land/x/mongo@v0.29.2/mod.ts";
const client = new MongoClient();
await client.connect("mongodb://mongo:27017");
const db = client.database('itemsearch');

export interface Player {
  _id: string,
  name: string,
  lastChecked: number,
  lastInPit: number,
}

export interface Item {
  _id: Bson.ObjectId
  itemId: number,
  meta: number,
  count: number,
  name?: string,
  lore?: string,
  cleanText: string,
  color?: string,
  unbreakable: boolean,
  mysticProps?: {
    nonce: number,
    lives: number,
    tier: number,
    maxLives: number,
    gemmed: boolean,
    tokens: number,
    rareCount: number,
    enchants: {
      version?: number,
      level: number,
      key: string,
    }[],
  },
  owner: string,
  ownerName: string,
  lastChecked: number,
  lastInPit: number,
}

export const players = db.collection<Player>("players");
export const items = db.collection<Item>("items");

await items.createIndexes({
  indexes: [
    { key: { itemId: 1 }, name: 'itemId' },
    { key: { count: 1 }, name: 'count' },
    { key: { cleanText: 'text' }, name: 'text' },
    { key: { color: 1 }, name: 'color', sparse: true },
    { key: { owner: 1 }, name: 'owner' },
    { key: { lastChecked: 1 }, name: 'lastChecked' },
    { key: { lastInPit: 1 }, name: 'lastInPit' },
    { key: { 'mysticProps.nonce': 1 }, name: 'nonce', sparse: true },
    { key: { 'mysticProps.lives': 1 }, name: 'lives', sparse: true },
    { key: { 'mysticProps.tier': 1 }, name: 'tier', sparse: true },
    { key: { 'mysticProps.maxLives': 1 }, name: 'maxLives', sparse: true },
    { key: { 'mysticProps.gemmed': 1 }, name: 'gemmed', sparse: true },
    { key: { 'mysticProps.tokens': 1 }, name: 'tokens', sparse: true },
    { key: { 'mysticProps.rareCount': 1 }, name: 'rareCount', sparse: true },
    { key: { 'mysticProps.enchants.version': 1 }, name: 'ench_ver', sparse: true },
    { key: { 'mysticProps.enchants.level': 1 }, name: 'ench_level', sparse: true },
    { key: { 'mysticProps.enchants.key': 1 }, name: 'ench_key', sparse: true },
  ]
})


