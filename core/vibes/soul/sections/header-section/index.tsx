'use client';

import { clsx } from 'clsx';
import { forwardRef, useEffect, useState } from 'react';
import Headroom from 'react-headroom';

import { Banner } from '@/vibes/soul/primitives/banner';
import { Navigation } from '@/vibes/soul/primitives/navigation';

interface Props {
  navigation: React.ComponentPropsWithoutRef<typeof Navigation>;
  banner?: React.ComponentPropsWithoutRef<typeof Banner>;
}

export const HeaderSection = forwardRef<React.ComponentRef<'div'>, Props>(
  ({ navigation, banner }, ref) => {
    const [bannerElement, setBannerElement] = useState<HTMLElement | null>(null);
    const [bannerHeight, setBannerHeight] = useState(0);
    const [isFloating, setIsFloating] = useState(false);

    useEffect(() => {
      if (!bannerElement) return;

      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of entries) {
          setBannerHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(bannerElement);

      return () => {
        resizeObserver.disconnect();
      };
    }, [bannerElement]);

    return (
      <div ref={ref}>
        {banner && <Banner ref={setBannerElement} {...banner} />}
        <Headroom
          onPin={() => setIsFloating(true)}
          onUnfix={() => setIsFloating(false)}
          pinStart={bannerHeight}
        >
          <div className={clsx(
            'p-2',
            !isFloating && 'border-b border-solid border-b-[#DBDBDB]'
          )}>
            <Navigation {...navigation} isFloating={isFloating} />
          </div>
        </Headroom>
      </div>
    );
  },
);

HeaderSection.displayName = 'HeaderSection';
