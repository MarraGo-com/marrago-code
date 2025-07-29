// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/custom/DeferredStylesheets.tsx
// This new Client Component will handle loading our non-critical CSS.
// -------------------------------------------------------------------------
'use client';

import React from 'react';

export default function DeferredStylesheets() {
  return (
    <>
      {/* --- THIS IS THE KEY FIX --- */}
      {/* We now load the Leaflet CSS asynchronously from within a Client Component. */}
      {/* This prevents it from blocking the page render and fixes the build error. */}
      <link 
        rel="preload" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        as="style" 
        onLoad={(e: React.SyntheticEvent<HTMLLinkElement>) => { (e.currentTarget as HTMLLinkElement).rel = 'stylesheet'; }} 
      />
      <noscript>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </noscript>
    </>
  );
}