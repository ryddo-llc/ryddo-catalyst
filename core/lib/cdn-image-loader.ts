'use client';

import { ImageLoaderProps } from 'next/image';

export default function bcCdnImageLoader({ src, width, quality }: ImageLoaderProps): string {
  let url = src.replace('{:size}', `${width}w`);
  
  // Add compression parameter if not already present
  if (!url.includes('compression=') && !url.includes('lossy')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}compression=lossy`;
  }
  
  // Add quality parameter if specified and not already present
  if (quality && !url.includes('quality=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}quality=${quality}`;
  }

  return url;
}
