// /src/config/component-registry.ts
import { existsSync } from 'fs';
import { join } from 'path';

export type ComponentRegistry = Record<string, Record<string, string>>;

const clients = ['client-omar', 'client-456']; // Update with your actual client IDs
const components = [
  'HeroSection',
  'FeaturedExperiences',
  'WhyChooseUs',
  'SocialProofSection',
  'TestimonialsSection',
  'BlogHighlightsSection',
  'NewsletterSection',
];

export const getComponentRegistry = (theme: string): ComponentRegistry => {
  const registry: ComponentRegistry = {};

  // Initialize registry for each client
  clients.forEach((clientId) => {
    registry[clientId] = {};
    components.forEach((componentName) => {
      const overridePath = join(
        process.cwd(),
        'src',
        'themes',
        'overrides',
        clientId,
        'components',
        `${componentName}.tsx`
      );
      const themePath = join(
        process.cwd(),
        'src',
        'themes',
        theme,
        'sections',
        `${componentName}.tsx`
      );
      

      // Map to relative paths for @/ alias
      if (existsSync(overridePath)) {
        registry[clientId][componentName] = `themes/overrides/${clientId}/components/${componentName}`;
      } else if (existsSync(themePath)) {
        registry[clientId][componentName] = `themes/${theme}/sections/${componentName}`;
      } else {
        registry[clientId][componentName] = `themes/default/sections/${componentName}`;
      }
    });
  });

  // Default client fallback
  registry['default'] = {};
  components.forEach((componentName) => {
    const themePath = join(process.cwd(), 'src', 'themes', theme, 'sections', `${componentName}.tsx`);
    registry['default'][componentName] = existsSync(themePath)
      ? `themes/${theme}/sections/${componentName}`
      : `themes/default/sections/${componentName}`;
  });

  return registry;
};