// Type declarations for image imports via ~/public/ path alias
declare module '~/public/icons/*.png' {
  import { StaticImageData } from 'next/image';

  const content: StaticImageData;

  export default content;
}
