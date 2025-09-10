// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/layout.tsx
// This file now imports and uses our new DeferredStylesheets component.
// -------------------------------------------------------------------------
import type { Metadata } from "next";
import dynamic from 'next/dynamic'; // Import dynamic
import "@/app/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {notFound} from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMainJsonLd, siteConfig } from "@/config/site";
import ThemeRegistry from "@/providers/ThemeRegistry";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeContextProvider } from "@/contexts/ThemeContext";

import DeferredStylesheets from "@/components/custom/DeferredStylesheets"; // <-- Import the new component
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { PageTransitionProps } from "@/themes/default/custom/PageTransition";
import { fontVariables } from "@/config/fonts";
// import Header from "@/themes/default/ui/Header";
import ConditionalHeader from "@/components/ui/ConditionalHeader";


// --- DYNAMIC THEME IMPORTS ---
// Get the current theme from the environment variable
const theme = process.env.NEXT_PUBLIC_THEME || 'default';

// Dynamically import components that are now part of the theme
const Footer  = dynamic(() => import(`@/themes/${theme}/ui/Footer`));

const WhatsApp = dynamic(() => import(`@/themes/${theme}/ui/WhatsApp`));

// const PageTransition = dynamic(() => import(`@/themes/${theme}/custom/PageTransition`));
const PageTransition = dynamic<PageTransitionProps>(() =>
  import(`@/themes/${theme}/custom/PageTransition`).then((mod) => mod.default)
);
export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
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
 // const fontClass = siteConfig.theme.font === 'lora' ? lora.variable : poppins.variable;
   const url = process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com"; // Ensure you have this environment variable set

 const mainJsonLd = getMainJsonLd({url});
// const currentFont = fontMap[siteConfig.theme.font] || poppins;
 return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="KkDc8if2_1qyK5fkzjUIy1nLclqoPywyU3YmpDOUWjs" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect hints to speed up connections */}
        <link rel="preconnect" href="https://tourism-template-prod.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mainJsonLd).replace(/</g, '\\u003c'),
        }}
      />
        {/* We now render the deferred stylesheets using our new Client Component */}
        <DeferredStylesheets />
      </head>
      <body className={fontVariables} >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ThemeContextProvider>
              <ThemeRegistry>
                <div className="flex flex-col min-h-screen">
                  <ConditionalHeader />
                  <main className="flex-grow">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <Footer />
                </div>
                <WhatsApp />
              </ThemeRegistry>
            </ThemeContextProvider>
          </QueryProvider>
        </NextIntlClientProvider>

         {/* --- 2. Add the Google Analytics component here --- */}
         {/* It will only render in production if the ID is set */}
         {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
           <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
