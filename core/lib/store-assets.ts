import { buildConfig } from '~/build-config/reader';

const storeHash = process.env.BIGCOMMERCE_STORE_HASH ?? '';

/**
 * Build the CDN image URL.
 * A query parameter containing the commit SHA is appended to the URL to ensure
 * that the asset is invalidated when the storefront app is deployed.
 *
 * @param {string} sizeSegment - The size segment of the URL. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`.
 * @param {string} source - The source of the image. Can be either `content` or `image-manager`.
 * @param {string} path - The path of the image relative to the source.
 * @param {number} cdnIndex - The index of the CDN URL to use. Defaults to 0.
 * @returns {string} The CDN image URL.
 */
const cdnImageUrlBuilder = (
  sizeSegment: string,
  source: string,
  path: string,
  cdnIndex = 0,
): string => {
  return `https://${buildConfig.get('urls').cdnUrls.at(cdnIndex)}/s-${storeHash}/images/stencil/${sizeSegment}/${source}/${path}`;
};

/**
 * Given a path, return the full URL to the content asset.
 * These assets are accessible via the /content folder in WebDAV on the store.
 * A query parameter containing the commit SHA is appended to the URL to ensure
 * that the asset is invalidated when the storefront app is deployed.
 *
 * @param {string} path - The path of the content asset.
 * @param {number} cdnIndex - The index of the CDN URL to use. Defaults to 0.
 * @returns {string} The full URL to the content asset.
 */
export const contentAssetUrl = (path: string, cdnIndex = 0): string => {
  return `https://${buildConfig.get('urls').cdnUrls.at(cdnIndex)}/s-${storeHash}/content/${path}`;
};

/**
 * Build a URL or resizable URL template for an image in the /content folder in WebDAV.
 *
 * @param {string} path - The path of the image relative to the /content folder.
 * @param {string} sizeParam - The optional size parameter. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`. If omitted, will return the templated string containing `{:size}`.
 * @returns {string} The resizeable URL template for the image, which can be used with `<Image>`.
 */
export const contentImageUrl = (path: string, sizeParam?: string): string => {
  // return a urlTemplate that can be used with the <Image> component
  return cdnImageUrlBuilder(sizeParam || '{:size}', 'content', path);
};

/**
 * Build a URL or resizable URL template for an image in the Image Manager.
 *
 * @param {string} filename - The filename of the image managed by the image manager.
 * @param {string} sizeParam - The optional size parameter. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`. If omitted, will return the templated string containing `{:size}`.
 * @param {boolean} lossy - Whether to apply lossy compression. Defaults to true for better performance.
 * @param {number} quality - Optional quality parameter (1-100). If specified and sizeParam is not a template, adds quality param to URL.
 * @param {boolean} bustCache - Whether to add a cache-busting parameter based on build time. Defaults to true.
 * @returns {string} The resizeable URL template for the image, which can be used with `<Image>`.
 */
export const imageManagerImageUrl = (filename: string, sizeParam?: string, lossy = true, quality?: number, bustCache = true): string => {
  // return a urlTemplate that can be used with the <Image> component
  let url = cdnImageUrlBuilder(sizeParam || '{:size}', 'image-manager', filename);

  // Determine if we should add query parameters
  const shouldAddParams = sizeParam !== '{:size}';
  let hasParams = false;

  // Add compression parameter for better performance unless explicitly disabled
  // Don't add query params to URL templates as it breaks CDN loader template replacement
  if (lossy && sizeParam !== 'original' && shouldAddParams) {
    url = `${url}?compression=lossy`;
    hasParams = true;

    // Add quality parameter if specified and not a template
    if (quality) {
      url = `${url}&quality=${quality}`;
    }
  }

  // Add cache-busting parameter to force fresh image fetches when content changes
  // Uses build time or deployment ID as cache key to invalidate on each deploy
  if (bustCache && shouldAddParams) {
    // Use NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA for Vercel deployments, or build time for local dev
    const cacheKey = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'dev';
    const separator = hasParams ? '&' : '?';

    url = `${url}${separator}v=${cacheKey}`;
  }

  return url;
};
