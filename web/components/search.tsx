import React, { useState } from 'react';
import { Item } from '../../shared/types.ts';
import { useTheme, useSearching, resultsAtom, queryStringAtom, hasNextPageAtom } from '~/lib/atoms.ts';

type Response = { success: false } | {
  success: true,
  docs: Item[],
  next: boolean,
}

export const Search = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useSearching();

  const execute = async () => {
    if(searching) return;
    setSearching(true);
    const route = `/api/items?page=0&search=${search}`;
    const response = await fetch(route);
    const data: Response = await response.json();
    console.log(route, data)
    queryStringAtom.set(search);
    if(!data.success) {
      resultsAtom.set([]);
      hasNextPageAtom.set(false);
    }else{
      resultsAtom.set(data.docs);
      hasNextPageAtom.set(data.next);
    }
    setSearching(false);
  }

  return (
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      onKeyDown={e => { if(e.key === 'Enter') execute(); }}
      style={{
        width: '60%',
        backgroundColor: theme.altBackground,
        margin: 'auto',
        display: 'block',
        padding: '10px',
        color: theme.altText,
        fontFamily: 'Minecraftia'
      }}
    />
  )
}
