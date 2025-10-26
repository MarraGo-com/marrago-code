// /src/providers/ThemeRegistry.tsx
"use client";

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getThemeOptions } from "@/config/theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	// Get dynamic theme settings from the context
	const { primaryColor, secondaryColor, font } = useThemeContext();

	const mode = prefersDarkMode ? "dark" : "light";

	// Recreate theme when relevant values change
	const theme = React.useMemo(
		() => createTheme(getThemeOptions(mode, primaryColor, secondaryColor, font)),
		[mode, primaryColor, secondaryColor, font]
	);

	return (
		<AppRouterCacheProvider options={{ enableCssLayer: true }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	);
}