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
  unbreakable: boolean,
  lore: string,
  color?: string,
  mysticProps?: {
    nonce: number,
    lives: number,
    tier: number,
    maxLives: number,
    gemmed: boolean,
    enchants: {
      version?: number,
      level: number,
      key: number,
    }[],
  },
  owner: string,
  ownerName: string,
  lastChecked: number,
  lastInPit: number,
}

export const players = db.collection<Player>("players");
export const items = db.collection<Item>("items");


