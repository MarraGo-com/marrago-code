// /src/contexts/ThemeContext.tsx
'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { siteConfig } from '@/config/client-data';
import { CardStyle, FontChoice } from '@/config/types';

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  font: FontChoice;
  setFont: (font: FontChoice) => void;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState<string>(
    siteConfig.colors.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    siteConfig.colors.secondaryColor
  );
  const [font, setFont] = useState<FontChoice>(siteConfig.theme.font);
  const [cardStyle, setCardStyle] = useState<CardStyle>(
    siteConfig.theme.cardStyle
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      primaryColor,
      setPrimaryColor,
      secondaryColor,
      setSecondaryColor,
      font,
      setFont,
      cardStyle,
      setCardStyle,
    }),
    [primaryColor, secondaryColor, font, cardStyle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThemeContext must be used within a ThemeContextProvider'
    );
  }
  return context;
}