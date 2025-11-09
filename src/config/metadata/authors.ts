// src/config/metadata/authors.ts
import { Author } from "next/dist/lib/metadata/types/metadata-types";

// This is the static, template-level author/creator info
// In your case, it's Upmerce or your brother's brand.
// For MarraGo, "Omar Ouazza" is both the AUTHOR and the CREATOR.

export const AUTHORS: Author = {
  name: "Omar Ouazza",
  url: "https://marrago.com", // This should be siteConfig.baseUrl, but this is fine for now
};

export const CREATOR: string = "Mustapha Ouazza";

// Add the Twitter-specific IDs here, since they are part of the author/creator identity.
// ℹ️ You must find these values. You can use a tool like 'tweeterid.com'
// ℹ️ For now, I will use placeholders.
export const TWITTER_SITE_ID: string = "YOUR_MARRAGO_TWITTER_ID"; // e.g., "123456789"
export const TWITTER_CREATOR_ID: string = "YOUR_OMAR_OUAZZA_TWITTER_ID"; // e.g., "987654321"