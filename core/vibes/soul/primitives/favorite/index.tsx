import * as Toggle from '@radix-ui/react-toggle';

import { Heart } from '@/vibes/soul/primitives/favorite/heart';

export interface FavoriteProps {
  label?: string;
  checked?: boolean;
  setChecked?: (liked: boolean) => void;
  variant?: 'default' | 'simple';
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --favorite-focus: hsl(var(--primary));
 *   --favorite-border: hsl(var(--contrast-100));
 *   --favorite-icon: hsl(var(--foreground));
 *   --favorite-on-background: hsl(var(--contrast-100));
 *   --favorite-off-border: hsl(var(--contrast-200));
 * }
 * ```
 */
export const Favorite = ({ checked = false, setChecked, label = 'Favorite', variant = 'default' }: FavoriteProps) => {
  const baseClasses = "group relative flex shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--favorite-icon,hsl(var(--foreground)))] ring-[var(--favorite-focus,hsl(var(--primary)))] transition-[colors,transform] duration-300 focus-within:outline-none focus-within:ring-2";

  const variantClasses = variant === 'simple'
    ? "h-6 w-6 text-gray-400 hover:bg-gray-100 hover:text-[#F92F7B] focus-visible:ring-2 focus-visible:ring-pink-500 sm:h-8 sm:w-8"
    : "h-[50px] w-[50px] border border-[var(--favorite-border,hsl(var(--contrast-100)))] data-[state=on]:bg-[var(--favorite-on-background,hsl(var(--contrast-100)))] data-[state=off]:hover:border-[var(--favorite-off-border,hsl(var(--contrast-200)))]";

  return (
    <Toggle.Root
      className={`${baseClasses} ${variantClasses}`}
      onPressedChange={setChecked}
      pressed={checked}
    >
      <Heart filled={checked} title={label} />
    </Toggle.Root>
  );
};
