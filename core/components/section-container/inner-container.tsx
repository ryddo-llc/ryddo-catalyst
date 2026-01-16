import { clsx } from 'clsx';

import { Image } from '~/components/image';

import type { InnerContainerProps, RoundedStyle } from './types';

function getRadiusStyle(radius: number, rounded: RoundedStyle): React.CSSProperties {
  const value = `${radius}px`;

  switch (rounded) {
    case 'all':
      return { borderRadius: value };

    case 'top':
      return { borderTopLeftRadius: value, borderTopRightRadius: value };

    case 'bottom':
      return { borderBottomLeftRadius: value, borderBottomRightRadius: value };

    case 'none':
    default:
      return {};
  }
}

export function InnerContainer({
  radius = 30,
  rounded = 'all',
  bgColor,
  bgImage,
  bgImageOpacity = 100,
  bgImagePosition = 'center',
  minHeight,
  maxHeight,
  padding,
  className,
  children,
  overflow = 'hidden',
}: InnerContainerProps) {
  const radiusStyle = getRadiusStyle(radius, rounded);

  return (
    <div
      className={clsx(
        'relative',
        bgColor,
        minHeight,
        maxHeight,
        padding,
        overflow === 'hidden' && 'overflow-hidden',
        overflow === 'auto' && 'overflow-auto',
        className,
      )}
      style={radiusStyle}
    >
      {bgImage ? (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: bgImageOpacity / 100,
            borderRadius: 'inherit',
          }}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover"
            fill
            preload
            sizes="100vw"
            src={bgImage}
            style={{ objectPosition: bgImagePosition }}
          />
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
