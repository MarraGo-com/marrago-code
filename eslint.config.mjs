import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from '@typescript-eslint/eslint-plugin'; // <-- Import the plugin
import typescriptParser from '@typescript-eslint/parser'; // <-- Import the parser

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Apply the Next.js recommended configurations first
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Add your custom override object *after* the extends
  {
    files: ["**/*.ts", "**/*.tsx"], // Target TypeScript files
    // You might need to explicitly specify parser and plugin again for overrides
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Disable the specific rule
      "@typescript-eslint/no-explicit-any": "off",

      // You can add other custom rule overrides here if needed
      // --- ADD THIS LINE ---
      // Disable the no-unescaped-entities rule
      "react/no-unescaped-entities": "off",
      // --- END ADD ---
    },
  },
];

export default eslintConfig;