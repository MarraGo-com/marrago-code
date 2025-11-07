// src/config/json-ld.ts

import { siteConfig } from "./client-data";




export function getMainJsonLd({ url }: { url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': siteConfig.businessType,
    name: siteConfig.brandName,
    url: url,
    logo: siteConfig.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'Customer Service',
      email: siteConfig.contact.email,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: siteConfig.addressLocality || 'Marrakech',
      addressRegion: siteConfig.addressRegion || 'Marrakech-Safi',
      addressCountry: siteConfig.addressCountry || 'MA'
    }
  };
}