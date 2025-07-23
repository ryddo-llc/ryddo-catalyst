import DOMPurify from 'isomorphic-dompurify';

/**
 * Safely sanitizes HTML content using DOMPurify
 * @param {string} html - The HTML string to sanitize
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html);
}

/**
 * Creates a sanitized dangerouslySetInnerHTML object
 * @param {string} html - The HTML string to sanitize
 * @returns {{ __html: string }} Object with sanitized HTML for dangerouslySetInnerHTML
 */
export function createSanitizedHtml(html: string) {
  return { __html: sanitizeHtml(html) };
} 