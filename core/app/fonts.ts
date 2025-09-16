import { Inter, Kanit, Nunito } from 'next/font/google';

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

const kanit = Kanit({
  display: 'swap',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-family-mono',
});

export const fonts = [inter, nunito, kanit];
