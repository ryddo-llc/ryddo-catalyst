import { Inter, Nunito } from 'next/font/google';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-body',
});

const nunito = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-heading',
});

const nunitoMono = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-mono',
});

export const fonts = [inter, nunito, nunitoMono];
