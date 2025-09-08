'use client';

import { usePathname } from 'next/navigation';
import Header  from "@/themes/default/ui/Header";
// Import your two different header components
// It's good practice to use dynamic imports here to keep your bundles small
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// Rename your existing large header component to HeroHeader or similar
const HeroHeader = dynamic(() => import(`@/themes/${theme}/ui/Header`));

// This would be your new, compact header for interior pages

export default function ConditionalHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  // Render the HeroHeader only on the homepage ('/').
  // For all other pages, render the compact InteriorHeader.
  return (
    <>
      {pathname === `/${[locale]}` ? <HeroHeader /> : <Header />}
    </>
  );
}
