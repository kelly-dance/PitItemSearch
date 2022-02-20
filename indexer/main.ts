import { getFriends, getPlayer, getKeyDelay } from './hypixel.ts';
import { Item, players, items } from './database.ts';

const queue: string[] = JSON.parse(Deno.readTextFileSync('./uuids.json'));

const processPlayer = async (uuid: string) => {
  const player = await getPlayer(uuid);
  if(player){
    await players.findAndModify({
      _id: player.uuid,
    }, {
      upsert: true,
      update: {
        name: player.name,
        lastChecked: Date.now(),
        lastInPit: player.lastInPit,
      },
    });
    await items.deleteMany({ owner: player.uuid });
    const cleaned: Item[] = player.items.map(i => {
      let mysticProps: Item['mysticProps'] | undefined = undefined;

      if(i.tag?.ExtraAttributes && !i.tag?.ExtraAttributes.bundle_contents) {
        const ex = i.tag?.ExtraAttributes
        mysticProps = {
          enchants: ex.CustomEnchants,
          gemmed: !!ex.UpgradeGemsUses,
          lives: ex.Lives,
          maxLives: ex.MaxLives,
          nonce: ex.Nonce,
          tier: ex.UpgradeTier,
        }
      }

      return {
        itemId: i.id,
        meta: i.Damage ?? 0,
        count: i.Count ?? 1,
        lastChecked: Date.now(),
        lastInPit: player.lastInPit,
        lore: i.tag?.display?.Lore?.join('\n') ?? '',
        owner: player.uuid,
        ownerName: player.name,
        unbreakable: !!i.tag?.Unbreakable,
        color: i.tag?.color,
        mysticProps,
      }
    }).filter(a => !!a) as Item[];
    if(cleaned.length) await items.insertMany(cleaned);
  }
}

while(true){
  const delay = getKeyDelay();
  const uuid = queue.shift();
  if(!uuid) break;
  const inDb = await players.findOne({ _id: uuid });
  if(!inDb) {
    console.log(`${uuid} ${queue.length}`)
    processPlayer(uuid);
  }else{
    console.log(`skip ${uuid} ${queue.length}`);
    continue;
  }
  await delay;
}

// while(true){
//   const delay = new Promise(resolve => setTimeout(resolve, 333));
//   if(queue.length === 0){
//     console.log('Empty');
//     const aggResult = await players.aggregate([{ $sample: { size: 1 } }]).toArray();
//     const randomPlayer = aggResult[0];
//     if(!randomPlayer) throw new Error();
//     const friends = await getFriends(randomPlayer._id);
//     queue.push(randomPlayer._id, ...friends.slice(0, 100));
//   }else{
//     const uuid = queue.shift()!;
//     console.log(`${uuid} ${queue.length}`)
//     processPlayer(uuid);
//   }
//   await delay;
// }
