export function getBase64BlurDataURL(): string {
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#e0e0e0" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f0f0f0" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer(1920, 620))}`;
}

export const blurDataURLs = {
  'super73-girl': 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAUAAkA4JZwCdAEO/gcqUAD++P3h5Ov18/zhzf5Pv8AgYbE6H8s+kx4pf6f//5P/vxjHkf//ye5s3IixYV/k/yYAA==',
  'default-background': 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoQAAkAAkA4JZwCdAEO/gcqUAD++QP39e7v//P8/5AA/vjE/+/s8/n9/e7v//P8/5AA/vjE/+/s8/n9/e7v//P8/5AA/vjE/+/s8/n9/e7vAAA=',
};