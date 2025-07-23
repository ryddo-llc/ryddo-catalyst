'use client';

import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';
import type { TermsNavigationItem, TermsSection } from '~/lib/data/terms-conditions';
import { createSanitizedHtml } from '~/lib/utils/sanitize-html';

interface Props {
  children?: React.ReactNode;
  content: TermsSection;
  currentPageId: string;
  navigationItems: TermsNavigationItem[];
  sidebarTitle?: string;
}

export function PrivacyPolicyPage({ children, content, currentPageId, navigationItems, sidebarTitle = "Terms & Conditions" }: Props) {
  return (
    <StickySidebarLayout
      containerSize="2xl"
      sidebar={
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{sidebarTitle}</h2>
            <nav className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a
                      className={`block px-4 py-3 rounded-lg text-md font-medium transition-colors ${
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
      sidebarSize="large"
    >
      <div className="space-y-8">
        {content.description ? (
          <div 
            className="text-lg text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={createSanitizedHtml(content.description)}
          />
        ) : null}

        {children}
      </div>
    </StickySidebarLayout>
  );
} 