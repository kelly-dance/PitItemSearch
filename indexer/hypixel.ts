import * as nbt from 'https://raw.githubusercontent.com/mcbobby123/nbt_parser/master/index.ts';

type ErrorResponse = {
  success: false,
}

type HypixelResponse<T> = ErrorResponse | T;

type FriendResponse = {
  success: true,
  uuid: string,
  records: {
    uuidReceiver: string,
    uuidSender: string,
  }[]
}

type Inventory = {
  data: number[]
}
type PlayerResponse = {
  success: true,
  player: {
    uuid: string,
    displayname: string,
    stats: {
      Pit?: {
        profile: {
          inv_contents: Inventory,
          inv_armor: Inventory,
          inv_enderchest: Inventory,
          item_stash?: Inventory,
          mystic_well_item?: Inventory,
          mystic_well_pants?: Inventory,
          spire_stash?: Inventory,
          last_save: number,
        },
      },
    },
  },
}

const apikeys: string[] = JSON.parse(Deno.readTextFileSync('./keys.json'));
const getKey = (() => {
  let i = 0;
  return () => {
    const key = apikeys[i];
    i = (i + 1) % apikeys.length;
    return key;
  }
})();

export const getKeyDelay = () => new Promise(resolve => setTimeout(resolve, 600 / apikeys.length))

export const getFriends = async (uuid: string): Promise<string[]> => {
  const res = await fetch(`https://api.hypixel.net/friends?key=${getKey()}&uuid=${uuid}`);
  const json: HypixelResponse<FriendResponse> = await res.json();
  if(!json.success) return [];
  return json.records.map(r => r.uuidSender === json.uuid ? r.uuidReceiver : r.uuidSender);
}

type Player = {
  uuid: string,
  name: string,
  lastInPit: number,
  items: any[],
}
export const getPlayer = async (uuid: string): Promise<Player | undefined> => {
  const res = await fetch(`https://api.hypixel.net/player?key=${getKey()}&uuid=${uuid}`);
  const json: HypixelResponse<PlayerResponse> = await res.json();
  if(!json.success) return undefined;
  if(!json.player.stats.Pit) return undefined;
  const profile = json.player.stats.Pit.profile;
  if(profile.spire_stash) {
    return {
      uuid: json.player.uuid,
      name: json.player.displayname,
      lastInPit: profile.last_save,
      items: [],
    }
  }else{
    const items: any[] = [];

    const sources = [
      'inv_contents',
      'inv_armor',
      'inv_enderchest',
      'item_stash',
      'mystic_well_item',
      'mystic_well_pants',
    ];

    for(const source of sources){
      const invData: number[] | undefined = (profile as any)[source]?.data;
      if(!invData) continue;
      const pitItems = nbt.simplify(nbt.parse(new Uint8Array(invData))).i;
      items.push(...pitItems);
    }

    return {
      uuid: json.player.uuid,
      name: json.player.displayname,
      lastInPit: profile.last_save,
      items: items.filter(i => Object.keys(i).length > 0 && 'id' in i),
    }
  }
  
}
