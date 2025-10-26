// src/lib/theme-component-loader.ts
// SERVER-ONLY UTILITY: Do not import into Client Components

import path from 'path';
import fs from 'fs';
import { siteConfig } from '@/config/client-data';

/**
 * [SERVER-ONLY] Gets the correct import function for a component.
 * It checks for a client-specific override first, then falls
 * back to the current theme.
 * * @param componentName The name of the component file (e.g., 'HeroSection')
 * @param subfolder The theme sub-folder (e.g., 'sections', 'custom', 'blog')
 */
export function getComponentImport(componentName: string, subfolder: string = 'sections') {
  
  // Use 'default' if siteConfig.templateTheme is missing.
 // const theme = siteConfig.templateTheme || 'default'; 
    const theme = process.env.NEXT_PUBLIC_THEME || 'default';

  // 1. Check for a client-specific override
  if (siteConfig.clientId) {
    // Override folder structure is always flat in /components/
    const overrideFile = `src/themes/overrides/${siteConfig.clientId}/components/${componentName}.tsx`;
    const fullOverridePath = path.join(process.cwd(), overrideFile);

    if (fs.existsSync(fullOverridePath)) {
      console.log(`[BUILD] Loading OVERRIDE for: ${componentName}`);
      return () => import(`@/themes/overrides/${siteConfig.clientId}/components/${componentName}`);
    }
  }

  // 2. Fallback to the base theme component
  // We now use the flexible 'subfolder' parameter
  return () => import(`@/themes/${theme}/${subfolder}/${componentName}`);
}