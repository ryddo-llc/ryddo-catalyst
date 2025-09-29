'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Link } from '~/components/link';

export interface DropdownMenuItem {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  component?: React.ReactNode;
  variant?: 'default' | 'danger';
  action?: string | ((event: React.MouseEvent<HTMLDivElement>) => void);
  asChild?: boolean;
}

interface Props extends PropsWithChildren {
  className?: string;
  items: Array<DropdownMenuItem | 'separator'>;
  align?: 'center' | 'end' | 'start' | undefined;
  slideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --dropdown-menu-background: hsl(var(--background));
 *   --dropdown-menu-item-focus: hsl(var(--primary));
 *   --dropdown-menu-item-text: hsl(var(--contrast-500));
 *   --dropdown-menu-item-text-hover: hsl(var(--foreground));
 *   --dropdown-menu-item-danger-text: hsl(var(--error));
 *   --dropdown-menu-item-danger-text-hover: color-mix(in oklab, hsl(var(--error)), black 75%);
 *   --dropdown-menu-item-background: transparent;
 *   --dropdown-menu-item-background-hover: hsl(var(--contrast-100));
 *   --dropdown-menu-item-danger-background: hsl(var(--error));
 *   --dropdown-menu-item-danger-background-hover: color-mix(in oklab, hsl(var(--error)), white 75%);
 *   --dropdown-menu-item-font-family: var(--font-family-body);
 * }
 * ```
 */
export const DropdownMenu = ({
  className = '',
  items,
  open,
  onOpenChange,
  align = 'end',
  slideOffset = 6,
  children,
}: Props) => {
  return (
    <DropdownMenuPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DropdownMenuPrimitive.Trigger asChild>{children}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          className={clsx(
            'z-50 max-h-80 max-w-lg overflow-y-auto rounded-2xl bg-background/50 backdrop-blur-2xl backdrop-saturate-200 p-2 shadow-2xl ring-1 ring-contrast-100/15 border border-contrast-100/20 data-[state=open]:animate-dropdown-show data-[state=closed]:animate-dropdown-hide @4xl:w-32 @4xl:rounded-2xl @4xl:p-2 relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none',
            className,
          )}
          sideOffset={slideOffset}
        >
          {items.map((item, index) => {
            if (item === 'separator') {
              return (
                <DropdownMenuPrimitive.Separator
                  className="my-1.5 h-[1px] bg-gradient-to-r from-transparent via-contrast-200 to-transparent opacity-30"
                  key={`dropdown-separator-${index}`}
                />
              );
            }

            const {
              className: itemClassName = '',
              action,
              label,
              variant = 'default',
              disabled,
              asChild,
            } = item;

            const itemLabel =
              typeof action === 'string' && !disabled ? (
                <Link className="block" href={action}>
                  {label}
                </Link>
              ) : (
                label
              );

            const labelIsComponent = Boolean(
              itemLabel && typeof itemLabel === 'object' && 'props' in itemLabel,
            );

            return (
              <DropdownMenuPrimitive.Item
                asChild={asChild ?? labelIsComponent}
                className={clsx(
                  'relative data-disabled:bg-contrast-100/15 data-disabled:text-contrast-300/95 data-disabled:cursor-not-allowed cursor-default rounded-lg bg-transparent px-3 py-2 font-[family-name:var(--dropdown-menu-item-font-family,var(--font-family-body))] text-sm font-medium outline-none transition-all duration-200',
                  {
                    default:
                      'text-contrast-500 ring-primary [&:not([data-disabled])]:hover:bg-contrast-100/25 [&:not([data-disabled])]:hover:backdrop-blur-sm [&:not([data-disabled])]:hover:text-foreground [&:not([data-disabled])]:hover:scale-[1.02] [&:not([data-disabled])]:data-[highlighted]:bg-contrast-100/25 [&:not([data-disabled])]:data-[highlighted]:backdrop-blur-sm [&:not([data-disabled])]:data-[highlighted]:text-foreground',
                    danger:
                      'text-error ring-primary [&:not([data-disabled])]:hover:bg-error/10 [&:not([data-disabled])]:hover:backdrop-blur-sm [&:not([data-disabled])]:hover:text-error [&:not([data-disabled])]:hover:scale-[1.02] [&:not([data-disabled])]:data-[highlighted]:bg-error/10 [&:not([data-disabled])]:data-[highlighted]:backdrop-blur-sm [&:not([data-disabled])]:data-[highlighted]:text-error',
                  }[variant],
                  itemClassName,
                )}
                disabled={disabled}
                key={`dropdown-item-${index}`}
                onClick={!disabled && action && typeof action === 'function' ? action : undefined}
              >
                {itemLabel}
              </DropdownMenuPrimitive.Item>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
