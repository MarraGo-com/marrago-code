// -------------------------------------------------------------------------
// UPDATED FILE: /src/app/[locale]/layout.tsx
// -------------------------------------------------------------------------
import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import "@/app/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {notFound} from 'next/navigation';
import { routing } from '@/i18n/routing';

import { siteConfig } from '@/config/client-data';

import ThemeRegistry from "@/providers/ThemeRegistry";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeContextProvider } from "@/contexts/ThemeContext";

import DeferredStylesheets from "@/components/custom/DeferredStylesheets";
// import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
// --- 2. ADDED new cookie system imports ---
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { PageTransitionProps } from "@/themes/default/custom/PageTransition";
import { fontVariables } from "@/config/fonts";
//import ConditionalHeader from "@/components/ui/ConditionalHeader";
import { getMainJsonLd } from "@/config/json-ld";

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 1. Import our server-side loader
import { getComponentImport } from "@/lib/theme-component-loader"; 
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
//import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import NewsletterPopup from "@/components/ui/NewsletterPopup";
//import GlobalNavigation from "@/components/layout/header/GlobalNavigation";
import { Box } from "@mui/material";
import { AuthProvider } from "@/contexts/AuthContext";

// 2. REMOVE the old 'theme' variable
// const theme = process.env.NEXT_PUBLIC_THEME || 'default'; // <-- REMOVED

// 3. Use getComponentImport to load the components
//const Footer = dynamic(getComponentImport('Footer', 'ui'));

// const WhatsApp = dynamic(getComponentImport('WhatsApp', 'ui')); // <-- Updated, but still commented

const PageTransition = dynamic<PageTransitionProps>(() =>
  getComponentImport('PageTransition', 'custom')().then((mod) => mod.default)
);

// Client-side runtime fix for a small top gap that can be injected by HMR/dev overlays

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "https://marrago.com"),
  title: {
    // This is the pattern for all child pages (e.g., "About Us | MarraGo")
    template: `%s | ${siteConfig.siteName}`,
    
    // This is the default title for the homepage (when %s is empty)
    default: `${siteConfig.siteName} - ${siteConfig.textContent.en.global.slogan}`, 
  },
  // Use the full, rich description as the default
  description: siteConfig.textContent.en.global.industrySpecifics,
};

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const url = process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com";

 const mainJsonLd = getMainJsonLd({url});

 return (
     <html lang={locale}>
       <head>
         <meta charSet="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         
         <meta name="google-site-verification" content="KkDc8if2_1qyK5fkzjUIy1nLclqoPywyU3YmpDOUWjs" />
         <link rel="icon" href="/favicon.ico" />
         
         <link rel="preconnect" href="https://tourism-template-prod.firebaseapp.com" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
           <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{
           __html: JSON.stringify(mainJsonLd).replace(/</g, '\\u003c'),
         }}
       />
         <DeferredStylesheets />
       </head>
       <body className={fontVariables}>
        <NextIntlClientProvider locale={locale} messages={messages}>
           <AuthProvider>
             <CookieConsentProvider>
              <QueryProvider>
             <ThemeContextProvider>
               <ThemeRegistry>
                 <div className="flex flex-col min-h-screen">
                   {/* <GlobalNavigation /> */}
                   <main className="flex-grow">
                    {/* ▼▼▼ THE PRO FIX: NAV SPACER ▼▼▼ */}
                     {/* This pushes content down by exactly the height of the Navbar.
                         Mobile: ~80px | Desktop: ~96px (64px toolbar + 32px padding) */}
                     <Box sx={{ 
                        height: { xs: '100px', md: '100px' }, 
                        width: '100%',
                        display: 'block' 
                     }} />
                     {/* ▲▲▲ FIX END ▲▲▲ */}
                     <PageTransition>
                       {children}
                     </PageTransition>
                   </main>
                   {/* <Footer /> */}
                 </div>
               </ThemeRegistry>
             </ThemeContextProvider>
           </QueryProvider>
           <AnalyticsScripts />
           <NewsletterPopup />
           {/* <FloatingWhatsApp /> */}
             </CookieConsentProvider>
           </AuthProvider>
        </NextIntlClientProvider>

       </body>
     </html>
  );
}