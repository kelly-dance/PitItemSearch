import type { APIHandler } from 'aleph/types.d.ts';
import { items } from '../../shared/database.ts';

const pageSize = 6 * 30;

export const handler: APIHandler = async ({ response, router }) => {
  const qs = router.query.get('search')?.toLowerCase();
  let page = parseInt(router.query.get('page') ?? '0');
  if(isNaN(page)) page = 0;
  if(!qs) return void response.json({ success: false });
  const docs = await items
    .find({ $text: { $search: qs } })
    .sort( { score: { $meta: "textScore" } } )
    .skip(page * pageSize)
    .limit(pageSize + 1)
    .toArray();
  response.json({ success: true, docs: docs.slice(0, pageSize), next: docs.length > pageSize });
}
