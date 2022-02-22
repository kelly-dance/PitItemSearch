import React from 'react';
import { useTheme, useSelectedItem } from '~/lib/atoms.ts';


export const Info = () => {
  const theme = useTheme();
  const [item] = useSelectedItem();

  return (
    <div
      style={{
        width: '460px',
        height: '580px',
        borderColor: theme.accent,
        borderWidth: '3px',
        borderStyle: 'solid',
        padding: '10px',
      }}
    >
      {item && (() => {
        return (
          <>
            {item.name}<br/>
            {item.lore}
          </>
        )
      })()}  
    </div>
  )
}
