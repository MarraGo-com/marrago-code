// -------------------------------------------------------------------------
// 2. NEW FILE: /src/app/[locale]/loading.tsx
// This is a special Next.js file that will automatically be rendered
// while the content of a page is loading on the server.
// -------------------------------------------------------------------------
import PageLoader from "@/components/ui/PageLoader";

export default function Loading() {
  // This component simply renders our beautiful PageLoader.
  return <PageLoader />;
}