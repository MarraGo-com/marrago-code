// -------------------------------------------------------------------------
// 1. NEW FILE: /src/types/article.ts
// Create a new 'types' folder in your 'src' directory for this file.
// -------------------------------------------------------------------------
// Define the shape of a single translation object for an article
export interface ArticleTranslation {
  title: string;
  content: string;
  description: string;
  locale: string; // e.g., 'en', 'fr'
  slug: string; // Unique slug for the article in this locale
}

// Define the comprehensive shape of our article data
export interface Article {
  id: string;
  title: string; // The title for the current locale for display purposes
  slug: string;
  status: 'published' | 'draft';
  coverImage: string;
  createdAt: string; // Serialized as an ISO string
  updatedAt?: string | null; // Optional, serialized as an ISO string
  translations: {
    en?: ArticleTranslation;
    fr?: ArticleTranslation;
    [key: string]: ArticleTranslation | undefined;
  };
}
