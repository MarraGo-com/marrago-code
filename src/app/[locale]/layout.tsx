// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/layout.tsx
// This file now imports and uses our new DeferredStylesheets component.
// -------------------------------------------------------------------------
import type { Metadata } from "next";
import "@/app/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMainJsonLd, siteConfig } from "@/config/site";
import { lora, poppins } from "@/config/theme";
import PageTransition from "@/components/custom/PageTransition";
import ThemeRegistry from "@/providers/ThemeRegistry";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import DeferredStylesheets from "@/components/custom/DeferredStylesheets"; // <-- Import the new component

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<Props>) {
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
 // const fontClass = siteConfig.theme.font === 'lora' ? lora.variable : poppins.variable;
   const url = process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com"; // Ensure you have this environment variable set

 const mainJsonLd = getMainJsonLd({url});
 
 return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      <body className={`${poppins.variable} ${lora.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ThemeContextProvider>
              <ThemeRegistry>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <Footer />
                </div>
                <ThemeSwitcher />
              </ThemeRegistry>
            </ThemeContextProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
