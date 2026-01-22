import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Link } from '~/components/link';

interface LinkItem {
  href: string;
  label: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  instagram: string;
}

export interface Section {
  title?: string;
  links: LinkItem[];
  contact?: ContactInfo;
}

export interface FooterContentProps {
  sections: Streamable<Section[]>;
  copyright?: ReactNode;
  className?: string;
}

export const FooterContent = ({
  sections: streamableSections,
  copyright,
  className,
}: FooterContentProps) => {
  return (
    <div
      className={clsx(
        'rounded-[30px] border-[rgb(0,12,31)] bg-[rgb(0,16,43)] px-6 pb-4 pt-8 @xl:px-10 @xl:pb-6 @xl:pt-10 @4xl:px-16 @4xl:pb-8 @4xl:pt-12',
        className,
      )}
    >
      {/* Footer Columns with Newsletter */}
      <Stream fallback={<FooterColumnsSkeleton />} value={streamableSections}>
        {(sections) => {
          if (sections.length > 0) {
            return (
              <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
                {/* Footer Link Columns */}
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                  {sections.map(({ title, links, contact }, i) => (
                    <div key={i}>
                      {title != null && (
                        <h3 className="mb-4 font-[family-name:var(--font-family-body)] font-semibold text-[rgb(174,170,170)]">
                          {title}
                        </h3>
                      )}

                      <ul className="space-y-0.5">
                        {links.map((link, idx) => (
                          <li key={idx}>
                            <Link
                              className="block font-[family-name:var(--font-family-body)] text-sm font-medium text-[rgb(0,94,255)] transition-colors hover:text-[#F92F7B]"
                              href={link.href}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Contact Info for Partner section */}
                      {contact && (
                        <div className="mt-6 space-y-1 text-sm">
                          <p className="font-[family-name:var(--font-family-body)] font-semibold text-[rgb(174,170,170)]">
                            Contact Us
                          </p>
                          <p className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)]">
                            p.{' '}
                            <a
                              className="transition-colors hover:text-[#F92F7B]"
                              href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                            >
                              {contact.phone}
                            </a>
                          </p>
                          <p className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)]">
                            e.{' '}
                            <a
                              className="transition-colors hover:text-[#F92F7B]"
                              href={`mailto:${contact.email}`}
                            >
                              {contact.email}
                            </a>
                          </p>
                          <p className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)]">
                            ig.{' '}
                            <Link
                              className="transition-colors hover:text-[#F92F7B]"
                              href={contact.instagram}
                            >
                              RyddoUSA
                            </Link>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Newsletter Section */}
                <div className="lg:w-80">
                  <h3 className="mb-6 font-[family-name:var(--font-family-body)] font-semibold text-[rgb(174,170,170)]">
                    Newsletter Sign Up
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        className="w-full rounded-[10px] border border-[rgb(0,94,255)] bg-transparent py-2.5 pl-4 pr-24 font-[family-name:var(--font-family-body)] text-[15px] text-white placeholder-[rgb(0,94,255)] focus:border-white focus:outline-none"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <button
                        className="absolute right-1 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-[#F92F7B] px-5 py-1.5 font-[family-name:var(--font-family-body)] text-[15px] font-semibold text-white transition-colors hover:bg-pink-600"
                        type="button"
                      >
                        Sign Up
                      </button>
                    </div>
                    <p className="font-[family-name:var(--font-family-body)] text-xs font-medium text-[rgb(0,94,255)]">
                      Receive our weekly newsletter <br /> with new product releases,
                      <br /> discounts, promotions, trade- <br />
                      in deals, service tips, and <br />
                      much more.
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        }}
      </Stream>

      {/* Copyright Section */}
      {copyright}
    </div>
  );
};

function FooterColumnsSkeleton() {
  return (
    <Skeleton.Root
      className="grid max-w-5xl grid-cols-1 gap-y-8 @container-normal group-has-[[data-pending]]/footer:animate-pulse @sm:grid-cols-2 @xl:gap-y-10 @2xl:grid-cols-3 @6xl:[grid-template-columns:_repeat(auto-fill,_minmax(220px,_1fr))]"
      pending
    >
      {Array.from({ length: 4 }).map((_, idx) => (
        <div className="pr-8" data-pending key={idx}>
          <div className="mb-3 flex items-center">
            <Skeleton.Text characterCount={10} className="rounded" />
          </div>
          <FooterColumnSkeleton />
        </div>
      ))}
    </Skeleton.Root>
  );
}

function FooterColumnSkeleton() {
  return (
    <ul>
      {Array.from({ length: 4 }).map((_, idx) => (
        <li className="py-2 text-sm" key={idx}>
          <Skeleton.Text characterCount={10} className="rounded" />
        </li>
      ))}
    </ul>
  );
}
