// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/lib/utils.ts
// We are adding a helper function to create clean text summaries.
// -------------------------------------------------------------------------
/**
 * Strips Markdown syntax from a string and truncates it.
 * @param markdown - The input string with Markdown.
 * @param length - The desired length of the output string.
 * @returns A plain text string summary.
 */
export function createSummary(markdown: string, length: number = 100): string {
  if (!markdown) return '';

  // This removes Markdown syntax using regular expressions
  const plainText = markdown
    .replace(/#{1,6}\s/g, '') // Headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Code
    .replace(/(\r\n|\n|\r)/gm, ' '); // Newlines

  if (plainText.length <= length) {
    return plainText;
  }

  return plainText.substring(0, length).trim() + '...';
}
