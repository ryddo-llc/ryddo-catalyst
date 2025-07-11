import { DM_Serif_Text, Inter, Nunito, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-body',
});

const dmSerifText = DM_Serif_Text({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-heading',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-family-mono',
});

const nunito = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-nunito',
});

export const fonts = [inter, dmSerifText, robotoMono, nunito];
