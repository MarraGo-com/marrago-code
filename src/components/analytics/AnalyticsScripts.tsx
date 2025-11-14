// src/components/analytics/AnalyticsScripts.tsx
"use client";


import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useEffect } from "react";

export default function AnalyticsScripts() {
  const { consent } = useCookieConsent();

  // Optional: Log to console to verify consent state
  useEffect(() => {
    console.log("Cookie Consent State:", consent);
  }, [consent]);

  return (
    <>
      {consent.analytics && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </>
  );
}