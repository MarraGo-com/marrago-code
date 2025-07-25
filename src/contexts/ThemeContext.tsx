// /src/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { siteConfig, PaletteName, FontChoice, CardStyle } from '@/config/site';

// 1. Define the shape of the data that our context will hold.
// It includes the current theme settings and functions to change them.
interface ThemeContextType {
  palette: PaletteName;
  setPalette: (palette: PaletteName) => void;
  font: FontChoice;
  setFont: (font: FontChoice) => void;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
}

// 2. Create the React Context.
// We initialize it as undefined because it will only have a value inside the Provider.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Create the Provider component.
// This component will wrap our application and manage the theme state.
export function ThemeContextProvider({ children }: { children: ReactNode }) {
  // Initialize the state with the default values from our central config file.
  const [palette, setPalette] = useState<PaletteName>(siteConfig.theme.palette);
  const [font, setFont] = useState<FontChoice>(siteConfig.theme.font);
  const [cardStyle, setCardStyle] = useState<CardStyle>(siteConfig.theme.cardStyle);

  const value = {
    palette,
    setPalette,
    font,
    setFont,
    cardStyle,
    setCardStyle,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Create a custom hook for easy access.
// This is a professional pattern that makes using the context cleaner and safer.
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
}
