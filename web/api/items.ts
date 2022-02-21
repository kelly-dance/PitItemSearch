import type { APIHandler } from 'aleph/types.d.ts';
import { items } from '../../shared/database.ts';

export const handler: APIHandler = async ({ response }) => {
  const docs = await items.find({ mysticProps: { $exists: true } }).limit(50).toArray();
  console.log(docs);
  response.json({ docs })
}
