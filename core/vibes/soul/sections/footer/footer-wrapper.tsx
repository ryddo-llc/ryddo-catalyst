import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Image } from '~/components/image';
import { imageManagerImageUrl } from '~/lib/store-assets';

export interface FooterWrapperProps {
  children: ReactNode;
  className?: string;
  backgroundExtensionHeight?: string;
  backgroundPositionY?: string;
}

export const FooterWrapper = ({
  children,
  className,
  backgroundExtensionHeight = '0px',
  backgroundPositionY = 'bottom',
}: FooterWrapperProps) => {
  const footerBgUrl = imageManagerImageUrl('footer-bg.png', 'original');

  return (
    <footer
      className={clsx('group/footer relative bg-[rgb(0,12,31)] text-white @container', className)}
    >
      {/* Background image - extends above the footer content */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ top: `-${backgroundExtensionHeight}` }}
      >
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="100vw"
          src={footerBgUrl}
          style={{ objectPosition: `center ${backgroundPositionY}` }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-6 pt-12 @xl:px-10 @xl:pb-8 @xl:pt-16 @4xl:px-16 @4xl:pb-10 @4xl:pt-20">
        {children}
      </div>
    </footer>
  );
};
