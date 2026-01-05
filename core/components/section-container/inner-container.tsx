import { clsx } from 'clsx';

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
  minHeight,
  maxHeight,
  padding,
  className,
  children,
  overflow = 'hidden',
}: InnerContainerProps) {
  const radiusStyle = getRadiusStyle(radius, rounded);
  const bgImageStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

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
        bgImage && 'bg-cover bg-center',
        className,
      )}
      style={{ ...radiusStyle, ...bgImageStyle }}
    >
      {children}
    </div>
  );
}
