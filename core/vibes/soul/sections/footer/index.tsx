import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Image } from '~/components/image';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Link } from '~/components/link';
import { imageManagerImageUrl } from '~/lib/store-assets';

interface Link {
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
  links: Link[];
  contact?: ContactInfo;
}

export interface FooterProps {
  sections: Streamable<Section[]>;
  copyright?: ReactNode;
  className?: string;
  backgroundExtensionHeight?: string;
  backgroundPositionY?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --footer-focus: hsl(var(--primary));
 *   --footer-background: hsl(var(--background));
 *   --footer-border-top: hsl(var(--contrast-100));
 *   --footer-border-bottom: hsl(var(--primary));
 *   --footer-contact-title: hsl(var(--contrast-500));
 *   --footer-contact-text: hsl(var(--foreground));
 *   --footer-social-icon: hsl(var(--contrast-400));
 *   --footer-social-icon-hover: hsl(var(--foreground));
 *   --footer-section-title: hsl(var(--foreground));
 *   --footer-link: hsl(var(--contrast-500));
 *   --footer-link-hover: hsl(var(--foreground));
 *   --footer-copyright: hsl(var(--contrast-500));
 * }
 * ```
 */
export const Footer = ({
  sections: streamableSections,
  copyright,
  className,
  backgroundExtensionHeight = '0px',
  backgroundPositionY = 'bottom',
}: FooterProps) => {
  const footerBgUrl = imageManagerImageUrl('footer-bg.png', 'original');

  return (
    <footer className={clsx('group/footer relative text-white @container', className)}>
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
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-12 @xl:px-10 @xl:py-16 @4xl:px-16 @4xl:py-20">
        <div className="rounded-[30px] border-[rgb(0,12,31)] bg-[rgb(0,16,43)] px-6 py-12 @xl:px-10 @xl:py-16 @4xl:px-16 @4xl:py-20">
          {/* Footer Columns with Newsletter */}
          <Stream fallback={<FooterColumnsSkeleton />} value={streamableSections}>
            {(sections) => {
              if (sections.length > 0) {
                return (
                  <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
                    {/* Footer Link Columns */}
                    <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                      {sections.map(({ title, links, contact }, i) => (
                        <div key={i}>
                          {title != null && (
                            <h3 className="mb-4 font-[family-name:var(--font-family-body)] font-semibold text-[rgb(174,170,170)]">
                              {title}
                            </h3>
                          )}

                          <ul className="space-y-1">
                            {links.map((link, idx) => (
                              <li key={idx}>
                                <Link
                                  className="block font-[family-name:var(--font-family-body)] text-sm font-medium text-[rgb(0,94,255)] transition-colors hover:text-white"
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
                                p. {contact.phone}
                              </p>
                              <p className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)]">
                                e. {contact.email}
                              </p>
                              <p className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)]">
                                ig.{' '}
                                <Link
                                  className="text-pink-500 underline hover:text-pink-400"
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
                      <h3 className="mb-4 font-[family-name:var(--font-family-body)] font-semibold text-[rgb(174,170,170)]">
                        Newsletter Sign Up
                      </h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            className="w-full rounded-[10px] border border-[rgb(0,94,255)] bg-transparent py-2 pl-4 pr-24 font-[family-name:var(--font-family-body)] text-sm text-white placeholder-[rgb(0,94,255)] focus:border-white focus:outline-none"
                            placeholder="Enter your email"
                            type="email"
                          />
                          <button
                            className="absolute right-1 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-[#F92F7B] px-3 py-1.5 font-[family-name:var(--font-family-body)] text-sm font-semibold text-white transition-colors hover:bg-pink-600"
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
      </div>
    </footer>
  );
};

// Keeping for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-underscore-dangle
function _SocialMediaLinksSkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/footer:animate-pulse" pending>
      <div className="flex items-center gap-3" data-pending>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton.Box className="h-8 w-8 rounded-full" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}

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
