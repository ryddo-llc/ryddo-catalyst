import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Link } from '~/components/link';

interface Link {
  href: string;
  label: string;
}

export interface Section {
  title?: string;
  links: Link[];
}

interface SocialMediaLink {
  href: string;
  icon: ReactNode;
}

export interface FooterProps {
  sections: Streamable<Section[]>;
  socialMediaLinks?: Streamable<SocialMediaLink[]>;
  infoSection?: ReactNode;
  contactSection?: ReactNode;
  copyright?: ReactNode;
  className?: string;
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
  socialMediaLinks: streamableSocialMediaLinks,
  infoSection,
  contactSection,
  copyright,
  className,
}: FooterProps) => {
  return (
    <footer
      className={clsx(
        'group/footer border-b-4 border-t border-b-[var(--footer-border-bottom,hsl(var(--primary)))] border-t-[var(--footer-border-top,hsl(var(--contrast-100)))] bg-[var(--footer-background,hsl(var(--background)))] @container',
        className,
      )}
    >
      <div className="mx-auto max-w-screen-2xl px-6 py-6 @xl:px-10 @xl:py-10 @4xl:px-16 @4xl:py-12">
        <div className="flex flex-col justify-between gap-x-20 gap-y-12 xl:flex-row">
                  <div className="flex flex-col gap-4 text-center sm:text-left xl:w-1/4 xl:gap-6">
          {infoSection}

            {/* Social Media Links */}
            <Stream fallback={<SocialMediaLinksSkeleton />} value={streamableSocialMediaLinks}>
              {(socialMediaLinks) => {
                if (socialMediaLinks != null) {
                  return (
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      {socialMediaLinks.map(({ href, icon }, i) => {
                        return (
                          <Link
                            className="flex items-center justify-center rounded-lg fill-[var(--footer-social-icon,hsl(var(--contrast-400)))] p-1 ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 ease-out hover:fill-[var(--footer-social-icon-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
                            href={href}
                            key={i}
                          >
                            {icon}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }
              }}
            </Stream>
          </div>

          {/* Footer Columns of Links */}
          <Stream fallback={<FooterColumnsSkeleton />} value={streamableSections}>
            {(sections) => {
              if (sections.length > 0) {
                return (
                  <div
                    className={clsx(
                      'grid grid-cols-1 gap-y-8 text-center sm:grid-cols-3 sm:text-left md:gap-x-2 lg:gap-x-6 xl:gap-y-10 justify-items-center sm:justify-items-start flex-1 mx-4',
                    )}
                  >
                    {sections.map(({ title, links }, i) => (
                      <div className="pr-2" key={i}>
                        {title != null && (
                          <span className="mb-3 block font-semibold text-[var(--footer-section-title,hsl(var(--foreground)))]">
                            {title}
                          </span>
                        )}

                        <ul>
                          {links.map((link, idx) => {
                            return (
                              <li key={idx}>
                                <Link
                                  className="block rounded-lg py-2 text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
                                  href={link.href}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}

                    {contactSection}

                  </div>
                );
              }
            }}
          </Stream>
        </div>

        {copyright}


      </div>
    </footer>
  );
};

function SocialMediaLinksSkeleton() {
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




