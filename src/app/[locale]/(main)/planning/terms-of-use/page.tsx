import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { Locale } from '@/config/types';
import TermsOfUseClient from '@/components/legal/TermsOfUseClient'; // <-- IMPORT the client component
import { getStaticPageMetadata } from '@/config/static-metadata';

// --- SEO Metadata (This is a Server-Side Function) ---
type MetadataProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params
}: MetadataProps): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://marrago.com';
  // Use 'termsOfUse' key to get metadata
  const {locale} = await params;
  const metadata = getStaticPageMetadata('termsOfUse', locale); 

  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: url,
    locale: locale,
  });
}

// --- Main Page Component (This is a Server Component) ---
export default function TermsOfUsePage() {
  // This component now only renders the client component.
  return (
    <TermsOfUseClient />
  );
}