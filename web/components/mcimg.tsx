import React, { CSSProperties } from 'react';

const mapped = [
  'FFAA00',
  '55FF55',
  '5555FF',
  'FFFF55',
  'FF5555',
  '55FFFF',
  '7DC383',
  '000000'
];

type Props = {
  id: number,
  meta?: number,
  color?: string,
  count: number
}

const countStyle: CSSProperties = {
  textShadow: '1px 1px #111',
  position: 'absolute',
  fontFamily: 'Minecraftia',
  fontSize: '8px',
  color: '#fff',
  marginLeft: '21px',
  marginTop: '18px',
}

export const McImg = ({ id, meta, color, count }: Props) => {
  if(id >= 298 && id <= 301 && !(id === 300 && mapped.includes(color?.substring(1) ?? ''))){ // leather items
    console.log('render mcimg TOP', id, meta, color, count)
    return (
      <div
        key={`${id}_${meta}_${color}_${count}`}
        className={`item_parent item_ item_${id} ${count===0?'grey':''}`}
        style={{
          backgroundColor: color ?? '835432',
        }}
      >
        {count !== 1 && <span style={countStyle}>{count}</span>}
      </div>
    );
  }else{
    console.log('render mcimg BOT', id, meta, color, count)
    return (
      <div
        key={`${id}_${meta}_${color}_${count}`}
        className={`item_parent item_ item_${id} item_${id}_${meta ?? color}`}
        style={{ backgroundColor: 'rgba(0,0,0,0)' }}
      >
        {count !== 1 && <span style={countStyle}>{count}</span>}
      </div>
    );
  }
}
