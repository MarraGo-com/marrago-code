// -------------------------------------------------------------------------
// 2. NEW FILE: /src/app/[locale]/loading.tsx
// This is a special Next.js file that will automatically be rendered
// while the content of a page is loading on the server.
// -------------------------------------------------------------------------
import dynamic from 'next/dynamic'; // Import dynamic
const theme = process.env.NEXT_PUBLIC_THEME || 'default';

// Dynamically import components that are now part of the theme
const PageLoader = dynamic(() => import(`@/themes/${theme}/ui/PageLoader`));

export default function Loading() {
  // This component simply renders our beautiful PageLoader.
  return <PageLoader />;
}