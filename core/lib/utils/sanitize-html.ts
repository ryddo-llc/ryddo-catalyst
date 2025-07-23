import DOMPurify from 'isomorphic-dompurify';

/**
 * Safely sanitizes HTML content using DOMPurify
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html);
}

/**
 * Creates a sanitized dangerouslySetInnerHTML object
 * @param html - The HTML string to sanitize
 * @returns Object with sanitized HTML for dangerouslySetInnerHTML
 */
export function createSanitizedHtml(html: string) {
  return { __html: sanitizeHtml(html) };
} 