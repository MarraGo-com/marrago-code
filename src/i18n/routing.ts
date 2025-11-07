// File: src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'fr', 'es'] as const; 

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'en'
});