import React from 'react';
import { useTheme, useSelectedItem } from '~/lib/atoms.ts';
import { McText } from './mctext.tsx';



export const Info = () => {
  const theme = useTheme();
  const [item] = useSelectedItem();

  return (
    <div
      style={{
        width: '460px',
        height: '128px',
        borderColor: theme.accent,
        borderWidth: '4px',
        borderStyle: 'solid',
        padding: '10px',
      }}
    >
      {item && (() => {
        return (
          <>
            <img style={{ float: 'right' }} width={100} src={`https://crafatar.com/avatars/${item.owner}?overlay=true`} />
            <McText text={`Owner: ${item.ownerName}`} /> <br />
            <McText text={`Lastseen in Pit: ${new Date(item.lastInPit).toLocaleString()}`} /> <br />
            <McText text={`Last verified: ${new Date(item.lastChecked).toLocaleString()}`} /> <br />
            <a href={`https://pitpanda.rocks/players/${item.owner}`} target="_blank" ><McText text={`§nOpen in PitPanda`} /></a><br />
          </>
        )
      })()}  
    </div>
  )
}
