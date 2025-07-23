'use client';

import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';
import type { TermsNavigationItem, TermsSection } from '~/lib/data/terms-conditions';
import { createSanitizedHtml } from '~/lib/utils/sanitize-html';

interface Props {
  content: TermsSection;
  navigationItems: TermsNavigationItem[];
  currentPageId: string;
  children?: React.ReactNode;
}

export function TermsPage({ content, navigationItems, currentPageId, children }: Props) {
  return (
    <StickySidebarLayout
      containerSize="2xl"
      sidebar={
        <div className="space-y-4 @4xl:space-y-6">
          <div>
            <h2 className="text-lg @4xl:text-xl font-bold text-gray-900 mb-4 @4xl:mb-6">Terms & Conditions</h2>
            <nav className="bg-gray-50 rounded-lg p-3 @4xl:p-4">
              <ul className="space-y-1 @4xl:space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a
                      className={`block px-3 @4xl:px-4 py-2 @4xl:py-3 rounded-lg text-sm @4xl:text-md font-medium transition-colors ${
                        item.id === currentPageId
                          ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-500'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      href={item.href}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      }
      sidebarSize="medium"
    >
      <div className="space-y-8">
        <div>
          <h1 
            className="text-4xl font-bold mb-4"
            dangerouslySetInnerHTML={createSanitizedHtml(content.title)}
          />
          {content.description ? (
            <div 
              className="text-lg text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={createSanitizedHtml(content.description)}
            />
          ) : null}
        </div>

        {children}
      </div>
    </StickySidebarLayout>
  );
} 