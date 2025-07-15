import { clsx } from 'clsx';

export interface BadgeProps {
  children: string;
  shape?: 'pill' | 'rounded';
  variant?: 'primary' | 'warning' | 'error' | 'success' | 'info';
  className?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --badge-primary-background: hsl(var(--primary));
 *   --badge-accent-background: hsl(var(--accent));
 *   --badge-success-background: hsl(var(--success));
 *   --badge-warning-background: hsl(var(--warning));
 *   --badge-error-background: hsl(var(--error));
 *   --badge-info-background: hsl(var(--background));
 *   --badge-text: hsl(var(--foreground));
 *   --badge-font-family: var(--font-family-mono);
 * }
 * ```
 */
export function Badge({ children, shape = 'rounded', className, variant = 'primary' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'px-2 py-0.5 font-[family-name:var(--badge-font-family,var(--font-family-mono))] text-xs uppercase tracking-tighter text-[var(--badge-text,hsl(var(--foreground)))]',
        {
          pill: 'rounded-full',
          rounded: 'rounded',
        }[shape],
        {
          primary: 'bg-[var(--badge-primary-background,hsl(var(--primary)))]',
          warning: 'bg-[var(--badge-warning-background,hsl(var(--warning)))]',
          error: 'bg-[var(--badge-error-background,hsl(var(--error)))]',
          success: 'bg-[var(--badge-success-background,hsl(var(--success)))]',
          info: 'bg-[var(--badge-info-background,hsl(var(--background)))]',
        }[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
