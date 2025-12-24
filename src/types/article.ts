// src/types/article.ts

// 1. Define the shape of a single translation object
export interface ArticleTranslation {
  title: string;
  // CHANGED: 'any' allows the complex Rich Text JSON structure (p, h, list, image, product cards, etc.)
  // We no longer use 'string' because that would only support basic text/markdown.
  content: any; 
  description: string;
  locale: string;
  slug: string;
  author?: string;
}

// 2. Define the comprehensive shape of our article data
export interface Article {
  id: string;
  title: string; // The title for the current locale for display purposes
  slug: string;
  status: 'published' | 'draft';
  coverImage: string;
  createdAt: string; // Serialized as an ISO string
  updatedAt?: string | null;
  author: string;
  translations: {
    en?: ArticleTranslation;
    fr?: ArticleTranslation;
    es?: ArticleTranslation;
    [key: string]: ArticleTranslation | undefined;
  };
}