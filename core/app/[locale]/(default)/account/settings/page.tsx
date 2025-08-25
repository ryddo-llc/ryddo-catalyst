import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AccountSettingsSection } from '@/vibes/soul/sections/account-settings';

import { changePassword } from './_actions/change-password';
import { updateCustomer } from './_actions/update-customer';
import { getCustomerSettingsQuery } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Account.Settings' });

  return {
    title: t('title'),
  };
}

export default async function Settings({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Account.Settings');

  const customerSettings = await getCustomerSettingsQuery();

  if (!customerSettings) {
    notFound();
  }

  return (
    <div className="h-full">
      {/* Content Panel Header */}
      <div className="mb-6 border-b border-[var(--account-card-border,hsl(var(--contrast-200)))] pb-4">
        <h2 className="font-[family-name:var(--account-title-font-family,var(--font-family-heading))] text-2xl font-bold text-[var(--account-title,hsl(var(--foreground)))]">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-[var(--account-subtitle,hsl(var(--contrast-500)))]">
          Update your account information and password
        </p>
      </div>

      {/* Settings Content */}
      <AccountSettingsSection
        account={customerSettings.customerInfo}
        changePasswordAction={changePassword}
        changePasswordSubmitLabel={t('cta')}
        changePasswordTitle={t('changePassword')}
        confirmPasswordLabel={t('confirmPassword')}
        currentPasswordLabel={t('currentPassword')}
        newPasswordLabel={t('newPassword')}
        title="" // Remove duplicate title since we have panel header
        updateAccountAction={updateCustomer}
        updateAccountSubmitLabel={t('cta')}
      />
    </div>
  );
}
