import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { Locale } from '@/config/types';
import { getStaticPageMetadata } from '@/config/static-metadata';
import PrivacyPolicyClient from '@/components/legal/PrivacyPolicyClient';

// --- SEO Metadata (This is a Server-Side Function) ---
type MetadataProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params
}: MetadataProps): Promise<Metadata> {
  const {locale} = await params;
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://marrago.com';
  const metadata = getStaticPageMetadata('privacyPolicy', locale);

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
export default function PrivacyPolicyPage() {
  // This component now only renders the client component.
  return (
    <PrivacyPolicyClient />
  );
}