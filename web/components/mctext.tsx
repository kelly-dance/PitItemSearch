import React, { memo, CSSProperties } from 'react';
import { zip } from '../lib/util.ts';

const colors: Record<string, string | undefined> = {
  '§0': '#000000',
  '§1': '#0000AA',
  '§2': '#00AA00',
  '§3': '#00AAAA',
  '§4': '#AA0000',
  '§5': '#AA00AA',
  '§6': '#FFAA00',
  '§7': '#999999',
  '§8': '#3f3f3f',
  '§9': '#5555FF',
  '§a': '#55FF55',
  '§b': '#55FFFF',
  '§c': '#FF5555',
  '§d': '#FF55FF',
  '§e': '#FFFF55',
  '§f': '#FFFFFF',
}

const formats: Record<string, CSSProperties | undefined> = {
  '§l': { fontWeight: 'bold' },
  '§m': { textDecoration: 'line-through' },
  '§n': { textDecoration: 'underline' },
  '§o': { fontStyle: 'italic' },
  '§r': {},
  '§k': {},
};

export const McText = memo(({ text }: { text: string }) => {
  const colorSections = text.split(/§[a-f0-9]/g);
  const colorMatches = ['§f', ...(text.match(/§[a-f0-9]/g) ?? [])];
  const children = zip(colorSections, colorMatches).map(([section, color], i) => {
    const formatSections = section.split(/§[klmnor]/g);
    const formatMatches = ['§r', ...(section.match(/§[klmnor]/g) ?? [])];
    const children = zip(formatSections, formatMatches).map(([section, format], i) => {
      return <span style={formats[format] ?? {}} key={i} >{section}</span>
    });
    return (
      <span style={{ color: colors[color] ?? '#FFF' }} key={i} >
        {children}
      </span>
    )
  });
  return (
    <span style={{ fontFamily: 'Minecraftia' }} >
      {children}
    </span>
  )
})
