'use client';

import { ImageLoaderProps } from 'next/image';

export default function bcCdnImageLoader({ src, width, quality }: ImageLoaderProps): string {
  let url = src.replace('{:size}', `${width}w`);

  // If the URL doesn't contain {:size} template, try to optimize it anyway
  if (!src.includes('{:size}') && src.includes('/images/stencil/')) {
    // For BigCommerce CDN URLs without template, try to extract and replace size segment
    url = url.replace(/\/(\d+w|original)\//g, `/${width}w/`);
  }

  // Add compression parameter if not already present
  if (!url.includes('compression=') && !url.includes('lossy')) {
    const separator = url.includes('?') ? '&' : '?';

    url = `${url}${separator}compression=lossy`;
  }

  // Add quality parameter if specified and not already present
  if (quality && !url.includes('quality=')) {
    const separator = url.includes('?') ? '&' : '?';

    url = `${url}${separator}quality=${quality}`;
  } else if (!quality && !url.includes('quality=')) {
    // Add default quality of 85 for better compression if not specified
    const separator = url.includes('?') ? '&' : '?';

    url = `${url}${separator}quality=85`;
  }

  return url;
}
