// /src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from "@/config/site";
import { lora, poppins } from "@/config/theme";
import PageTransition from "@/components/custom/PageTransition";
import ThemeRegistry from "@/providers/ThemeRegistry";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

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

  return (
    <html lang={locale}>
      {/* --- THIS IS THE KEY FIX --- */}
      {/* We are adding preconnect hints and fixing the Leaflet CSS link */}
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect hints to speed up connections to critical third-party domains */}
        <link rel="preconnect" href="https://tourism-template-prod.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        
        {/* The Leaflet CSS link, now without the 'integrity' attribute to prevent browser errors */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin=""/>
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
