import { MongoClient } from "https://deno.land/x/mongo@v0.29.2/mod.ts";
import { Item, Player } from './types.ts';

const client = new MongoClient();

await client.connect({
  db: 'itemsearch',
  servers: [
    {
      host: Deno.env.get('MONGO_HOST')!,
      port: parseInt(Deno.env.get('MONGO_PORT')!),
    },
  ],
  credential: {
    username: Deno.env.get('DATABASE_USERNAME'),
    password: Deno.env.get('DATABASE_PASSWORD'),
    db: 'itemsearch',
    mechanism: "SCRAM-SHA-1",
  },
})
const db = client.database('itemsearch');

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
    { key: { 'mysticProps.enchants.key': 1 }, name: 'enchKey', sparse: true },
    { key: { 'mysticProps.enchants.level': 1 }, name: 'enchLevel', sparse: true },
    { key: { 'mysticProps.enchants.version': 1 }, name: 'enchVer', sparse: true },
    { key: { 'vanillaEnchants.key': 1 }, name: 'vanillaEnchKey', sparse: true },
    { key: { 'vanillaEnchants.level': 1 }, name: 'vanillaEnchLevel', sparse: true },
  ]
})


