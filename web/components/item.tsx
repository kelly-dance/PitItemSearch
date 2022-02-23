import React from 'react';
import { useTheme, selectedItemAtom, useResultIndex, hoveredItemAtom } from '~/lib/atoms.ts';
import { McImg } from './mcimg.tsx';


export const Item = ({ index }: { index: number }) => {
  console.log('render item', index)
  const theme = useTheme();
  const item = useResultIndex(index);
  const self = React.createRef<HTMLDivElement>();

  if(!item) throw new Error();

  return (
    <div
      ref={self}
      onClick={() => selectedItemAtom.set(item)}
      onMouseEnter={() => hoveredItemAtom.set({ ref: self, item })}
      onMouseLeave={() => hoveredItemAtom.set(undefined)}
      style={{
        gridRow: 1 + Math.floor(index / 6),
        gridColumn: 1 + (index % 6),
        borderColor: theme.accent,
        borderWidth: '4px',
        borderStyle: 'solid',
        color:theme.text,
        width: '100%',
        height: '100%',
      }}
    >
      <McImg id={item.itemId} meta={item.meta} color={item.color} count={item.count} /> 
    </div>
  )
}
