// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/layout.tsx
// This is the final version of your RootLayout, now with the ThemeSwitcher.
// -------------------------------------------------------------------------
import type { Metadata } from "next";
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
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"; // <-- Import the new component
import "@/app/globals.css";

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
};

type Props = {
  children: React.ReactNode;
  params:  Promise<{ locale: string }>;
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
  // Removed unused variable fontClass

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhpmA9dtkFe/pVGqG0M9JT1z9PTgMBDfVFPc=" crossOrigin=""/>
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
                {/* The ThemeSwitcher is placed here so it floats above everything */}
                <ThemeSwitcher />
              </ThemeRegistry>
            </ThemeContextProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}