'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import React from 'react';

import { Button } from '../button';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

function Content({ title, children }: Props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[200] bg-foreground/30 backdrop-blur-[2px] @container">
        <Dialog.Content
          className={clsx(
            'fixed inset-y-0 right-0 flex w-[420px] max-w-full flex-col bg-background shadow-2xl transition duration-500 [animation-timing-function:cubic-bezier(0.25,1,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          )}
          forceMount
        >
          <div className="flex items-center justify-between gap-2 border-b border-contrast-100 bg-background px-6 py-5 @md:px-8">
            <Dialog.Title asChild>
              <div className="text-lg font-semibold">{title}</div>
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                className="h-8 w-8 rounded-full"
                shape="circle"
                size="small"
                variant="tertiary"
              >
                <X size={18} strokeWidth={1.5} />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}

const Root = Dialog.Root;
const Trigger = Dialog.Trigger;

export { Root, Trigger, Content };
