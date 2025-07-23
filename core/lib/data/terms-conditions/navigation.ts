import type { TermsNavigationItem } from './interfaces';

// Navigation items for the sidebar
export const termsNavigationItems: TermsNavigationItem[] = [
  {
    id: 'terms-of-use',
    title: 'Terms of Use',
    href: '/terms-conditions/',
    description: 'General terms and conditions for using our services'
  },
  {
    id: 'shipping-returns',
    title: 'Shipping, Returns, & Exchanges',
    href: '/shipping-returns-exchange-policies/',
    description: 'Our shipping, return, and exchange policies'
  },
  {
    id: 'price-match',
    title: 'Price Match Guarantee',
    href: '/price-match-guarantee/',
    description: 'Our price matching policy and guarantees'
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    href: '/privacy-policy/',
    description: 'How we collect, use, and protect your information'
  },
  {
    id: 'test-ride-waiver',
    title: 'Test Ride Waiver',
    href: '/test-ride-waiver/',
    description: 'Terms and conditions for test rides'
  }
]; 