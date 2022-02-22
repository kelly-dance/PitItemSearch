import React from 'react';
import { useTheme, useLength } from '~/lib/atoms.ts';
import { Item } from './item.tsx';


export const Results = ({ lazy }: { lazy?: boolean }) => {
  const length = useLength();
  const theme = useTheme();

  return (
    <div
      style={{
        width: 'min-content',
        borderColor: theme.accent,
        borderWidth: '3px',
        borderStyle: 'solid',
        padding: '10px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridAutoRows: '64px',
          gridTemplateColumns: 'repeat(6, 64px)',
        }}
      >
        {Array.from({ length }, (_, i) => (
          <>
            {!lazy && <Item index={i} key={i} />}
            {lazy && <div/>}
          </>
        ))}
      </div>
    </div>
  )
}
