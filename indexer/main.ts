import { getFriends, getPlayer, getKeyDelay } from './hypixel.ts';
import { Item, players, items } from '../shared/database.ts';

const rares = new Set<string>(JSON.parse(Deno.readTextFileSync('./rares.json')));
const nicknames: Record<string, undefined | string[]> = JSON.parse(Deno.readTextFileSync('./nicknames.json'));
type McItem = {
  type: number,
  meta: number,
  name: string,
}
const mcitems: McItem[] = JSON.parse(Deno.readTextFileSync('../shared/mcitems.json'));
const colors = ['red', 'yellow', 'blue', 'orange', 'green'];

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

      let mci = mcitems.find(mci => mci.type === i.id && mci.meta === (i.Damage ?? 0));
      if(!mci) mci = mcitems.find(mci => mci.type === i.id);
      if(!mci) mci = mcitems[0];

      if(i.tag?.ExtraAttributes && !i.tag?.ExtraAttributes.bundle_contents) {
        const ex = i.tag?.ExtraAttributes;
        const rawEnchants: any[] = ex.CustomEnchants ?? [];
        const enchants: { version?: number, level: number, key: string }[] = rawEnchants.map(e => ({
          version: e.Version,
          level: e.Level,
          key: e.Key,
        }))
        const tokens = enchants.reduce((a, c) => a + c.level, 0);
        const rareCount = enchants.filter(e => rares.has(e.key)).length;
        mysticProps = {
          enchants,
          tokens,
          rareCount,
          gemmed: !!ex.UpgradeGemsUses,
          lives: ex.Lives,
          maxLives: ex.MaxLives,
          nonce: ex.Nonce,
          tier: ex.UpgradeTier,
        }
      }

      let cleanText = '';
      if(i.tag?.display?.Name) cleanText += `\n${i.tag.display.Name}`;
      cleanText += `\n${player.name}`;
      cleanText += `\n${mci.name}`;
      if(i.tag?.Unbreakable) cleanText += '\nunbreakable';
      if(mysticProps){
        for(const ench of mysticProps.enchants){
          cleanText += `\n${ench.key} ${ench.level}`;
          nicknames[ench.key]?.forEach(n => cleanText += `\n${n} ${ench.level}`);
        }
        if(mysticProps.gemmed) cleanText += '\ngemmed';
         cleanText += `\n${mysticProps.tokens} tokens`;
         cleanText += `\n${mysticProps.lives} lives`;
         cleanText += `\n${mysticProps.maxLives} max lives`;
         cleanText += `\nlives: ${mysticProps.lives}/${mysticProps.maxLives}`;
         cleanText += `\ntier ${mysticProps.tier}`;
         if(mysticProps.nonce > 20) cleanText += `\n${colors[mysticProps.nonce % 5]}`;
         cleanText += `\nnonce ${mysticProps.nonce}`;
      }else{
        if(i.tag?.display?.Lore) cleanText += `\n${i.tag.display.Lore.join('\n')}`;
      }
      cleanText += `\n${i.id}:${i.Damage ?? 0}`;
      cleanText += `\ncount ${i.Count ?? 1}`;
      cleanText = cleanText.trim().toLowerCase().replace(/§./g, '');
      

      return {
        itemId: i.id,
        meta: i.Damage ?? 0,
        count: i.Count ?? 1,
        lastChecked: Date.now(),
        lastInPit: player.lastInPit,
        name: i.tag?.display?.Name ?? mci.name,
        lore: i.tag?.display?.Lore?.join('\n'),
        cleanText,
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

while(true) await getKeyDelay();

// while(true){
//   const delay = getKeyDelay()
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
