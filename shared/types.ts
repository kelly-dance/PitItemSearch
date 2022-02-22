import type { Bson } from "https://deno.land/x/mongo@v0.29.2/mod.ts";

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
  name: string,
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
  vanillaEnchants?: {
    key: string,
    value: number,
  }[]
  owner: string,
  ownerName: string,
  lastChecked: number,
  lastInPit: number,
}