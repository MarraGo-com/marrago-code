"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// UPDATED: Changed paths to a standard 'layout' folder
import CookieBanner from "@/components/layout/CookieBanner";
import CookieModal from "@/components/layout/CookieModal";

// 1. Define the shape of our consent state
export interface CookieConsentState {
  analytics: boolean;
  marketing: boolean;
}

// 2. Define what our Context will provide
interface CookieConsentContextType {
  consent: CookieConsentState;
  setConsent: (newState: Partial<CookieConsentState>) => void;
}

// 3. Define the default state (all denied)
const defaultConsent: CookieConsentState = {
  analytics: false,
  marketing: false,
};

// 4. Create the Context
const CookieConsentContext = createContext<CookieConsentContextType | undefined>(
  undefined
);

// 5. The Provider (The "Brain")
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsentState>(defaultConsent);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // 6. On mount, read localStorage
  useEffect(() => {
    setHasMounted(true);
    try {
      const storedConsent = localStorage.getItem("cookie_consent");
      if (storedConsent) {
        setConsentState(JSON.parse(storedConsent));
      } else {
        // No choice made yet, show the banner
        setIsBannerVisible(true);
      }
    } catch (error) {
      console.error("Could not parse cookie consent from localStorage", error);
      setIsBannerVisible(true);
    }
  }, []);

  // 7. Helper function to update state and localStorage
  const setConsent = (newState: Partial<CookieConsentState>) => {
    setConsentState((prev) => {
      const updatedState = { ...prev, ...newState };
      try {
        localStorage.setItem("cookie_consent", JSON.stringify(updatedState));
      } catch (error) {
        console.error("Could not save cookie consent to localStorage", error);
      }
      return updatedState;
    });
  };

  // --- Handlers for the UI ---

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setIsBannerVisible(false);
    setIsModalOpen(false);
  };

  const handleDeclineAll = () => {
    setConsent({ analytics: false, marketing: false });
    setIsBannerVisible(false);
    setIsModalOpen(false);
  };

  const handleSavePreferences = (newState: CookieConsentState) => {
    setConsent(newState);
    setIsBannerVisible(false);
    setIsModalOpen(false);
  };

  if (!hasMounted) {
    // Avoid rendering UI until we've checked localStorage
    return null;
  }

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent }}>
    {children}
      {isBannerVisible && (
        <CookieBanner
          onAcceptAll={handleAcceptAll}
          onDeclineAll={handleDeclineAll}
          onCustomize={() => setIsModalOpen(true)}
        />
      )}

      {isModalOpen && (
        <CookieModal
          currentConsent={consent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePreferences}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

// 8. The "Hook" (for easy access in other components)
export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};