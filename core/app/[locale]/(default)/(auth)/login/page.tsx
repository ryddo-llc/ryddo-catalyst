/* eslint-disable react/jsx-no-bind */
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SignInSection } from '@/vibes/soul/sections/sign-in-section';
import { buildConfig } from '~/build-config/reader';
import { ForceRefresh } from '~/components/force-refresh';

import { login } from './_actions/login';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Auth.Login' });

  return {
    title: t('title'),
  };
}

export default async function Login({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirectTo = '/account' } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('Auth.Login');

  const vanityUrl = buildConfig.get('urls').vanityUrl;
  const redirectUrl = new URL(redirectTo, vanityUrl);
  const redirectTarget = redirectUrl.pathname + redirectUrl.search;

  return (
    <>
      <ForceRefresh />
      <SignInSection
        action={login.bind(null, { redirectTo: redirectTarget })}
        emailLabel={t('email')}
        forgotPasswordHref="/login/forgot-password"
        forgotPasswordLabel={t('forgotPassword')}
        passwordLabel={t('password')}
        submitLabel={t('cta')}
        title={t('heading')}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8 font-[family-name:var(--sign-in-font-family,var(--font-family-body))]">
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
          <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
          
          <h2 className="mb-6 font-[family-name:var(--sign-in-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--reset-password-title,hsl(var(--foreground)))] @xl:text-4xl">
            {t('CreateAccount.title')}
            <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
          </h2>
          <div className="text-[var(--sign-in-description,hsl(var(--contrast-500)))]">
            <p className="mb-6 text-base font-medium">{t('CreateAccount.accountBenefits')}</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                <span className="text-sm font-medium">{t('CreateAccount.fastCheckout')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                <span className="text-sm font-medium">{t('CreateAccount.multipleAddresses')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                <span className="text-sm font-medium">{t('CreateAccount.ordersHistory')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                <span className="text-sm font-medium">{t('CreateAccount.ordersTracking')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                <span className="text-sm font-medium">{t('CreateAccount.wishlists')}</span>
              </li>
            </ul>
            <ButtonLink 
              className="mt-auto w-full bg-[#F92F7B] hover:bg-[#d41f63] border-[#F92F7B] hover:border-[#d41f63] text-white font-semibold transition-all duration-200 rounded-full py-4" 
              href="/register"
            >
              {t('CreateAccount.cta')}
            </ButtonLink>
          </div>
        </div>
      </SignInSection>
    </>
  );
}
