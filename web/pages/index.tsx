import React from 'react';
import { useTheme } from '~/lib/atoms.ts';
import { Search } from '~/components/search.tsx';
import { Results } from '~/components/results.tsx';
import { Info } from '~/components/info.tsx';
import { HoverDesc } from '~/components/hoverdesc.tsx';

export default function Home() {
  const theme = useTheme();

  return (
    <React.StrictMode>
    <div
      style={{

      }}
    >
      <head>
        <title>PISS</title>
        <link rel="stylesheet" href="../style/index.css" />
        <link rel="stylesheet" href="../style/items.css" />
        <link rel="stylesheet" href="../style/minecraft.css" />
        <style>
          {`
            body {
              background-color: ${theme.background};
            }
          `}
        </style>
      </head>
      <div style={{ position: 'sticky', zIndex: 100 }}><HoverDesc /></div>
      <div style={{ height: '50px' }} />
      <Search/>
      <div style={{ height: '50px' }} />
      <div style={{ margin: 'auto', position: 'relative', width: '0' }} >
        <div style={{ position: 'absolute', top: '0', right: '20px', marginBottom: '250px' }}>
          <Results/>
        </div>
        <div style={{ position: 'sticky', top: '30px', left: '20px' }}>
          <Info/>
        </div>
        <div style={{ visibility: 'hidden' }}>
          <Results lazy={true} />
        </div>
      </div>
    </div>
    </React.StrictMode>
  )
}
