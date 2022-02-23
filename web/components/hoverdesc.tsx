import React, { CSSProperties } from 'react';
import { useHoveredItem } from '~/lib/atoms.ts';
import { McText } from './mctext.tsx';

export const HoverDesc = () => {
  const [hovered] = useHoveredItem();
  let [pos, setPos] = React.useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const { ref, item } = hovered ?? {};

  if(ref) {
    const newPos = {
      x: 5 + (ref?.current?.getBoundingClientRect().right ?? 0),
      y: 5 + (ref?.current?.getBoundingClientRect().top ?? 0) - document.body.getBoundingClientRect().top,
    }
    if(newPos.x !== pos.x || newPos.y !== pos.y) {
      setPos(newPos);
      pos = newPos;
    }
  }

  const constantStyles: CSSProperties = {
    backgroundColor: '#120211',
    position: 'absolute',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #25015b',
    transition: 'top 0.1s, left 0.1s, opacity 0.2s',
    top: pos.y,
    left: pos.x,
  }
  const style: CSSProperties = hovered ? {
    ...constantStyles,
    opacity: 1,
  } : {
    ...constantStyles,
    visibility: 'hidden',
    opacity: 0,
  }

  return (
    <div
      style={style}
    >
      {item && (() => {
        return (
          <>
            <McText text={item.name} /><br/>
            {(item.lore ?? '').split('\n').map((line, i) => <React.Fragment key={`${i} ${line}`}><McText text={line} /><br/></React.Fragment>)}
          </>
        )
      })()}
    </div>
  )
}

/*
-webkit-transition: border 0.1s;
  -moz-transition: border 0.1s;
  -o-transition: border 0.1s;
  transition: border 0.1s;
*/