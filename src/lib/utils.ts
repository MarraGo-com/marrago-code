// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🟢 UPDATED: Handles both TipTap JSON and Old Markdown Strings
export function createSummary(content: any, limit: number = 150): string {
  if (!content) return '';

  let text = '';

  // CASE A: Content is the new TipTap JSON Object
  if (typeof content === 'object' && content !== null) {
    if (content.content && Array.isArray(content.content)) {
      // Loop through blocks (paragraphs, headings, etc.)
      for (const block of content.content) {
        if (block.content && Array.isArray(block.content)) {
          // Loop through text spans inside the block
          for (const span of block.content) {
            if (span.type === 'text' && span.text) {
              text += span.text + ' ';
            }
          }
        }
        // Stop processing if we already have enough text
        if (text.length >= limit) break;
      }
    }
  } 
  // CASE B: Content is an old String (Markdown)
  else if (typeof content === 'string') {
    text = content
      .replace(/#{1,6}\s/g, '') // Remove Headings
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove Italic
      .replace(/!\[(.*?)\]\(.*?\)/g, '') // Remove Images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove Links
      .replace(/>\s/g, ''); // Remove Blockquotes
  }

  // Final Cleanup & Truncate
  const cleanText = text.trim();
  if (cleanText.length <= limit) return cleanText;
  
  return cleanText.substring(0, limit).trim() + '...';
}