import React from 'react';
import { useTheme, selectedItemAtom, resultsAtom } from '~/lib/atoms.ts';


export const Item = ({ index }: { index: number }) => {
  const theme = useTheme();

  return (
    <div
      onClick={() => {
        selectedItemAtom.set(resultsAtom.get()[index])
      }}
      style={{
        gridRow: 1 + Math.floor(index / 6),
        gridColumn: 1 + (index % 6),
        borderColor: theme.accent,
        borderWidth: '3px',
        borderStyle: 'solid',
        color:theme.text,
        width: '100%',
        height: '100%',
      }}
    >
      {index}
    </div>
  )
}
