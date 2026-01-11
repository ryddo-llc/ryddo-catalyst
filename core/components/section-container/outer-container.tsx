import { clsx } from 'clsx';

import type { OuterContainerProps, RoundedStyle } from './types';

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

export function OuterContainer({
  radius = 30,
  rounded = 'bottom',
  bgColor = 'bg-white',
  padding = 'pb-6',
  innerPadding = 'px-2 @xl:px-2 @4xl:px-4',
  maxWidth = 'max-w-[var(--section-max-width-2xl,1400px)]',
  containerQuery = true,
  className,
  'aria-labelledby': ariaLabelledBy,
  children,
}: OuterContainerProps) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={clsx('relative z-20', bgColor, padding, containerQuery && '@container', className)}
      style={getRadiusStyle(radius, rounded)}
    >
      <div className={clsx('mx-auto', innerPadding, maxWidth)}>{children}</div>
    </section>
  );
}
