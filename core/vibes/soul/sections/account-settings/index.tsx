import { ChangePasswordAction, ChangePasswordForm } from './change-password-form';
import { Account, UpdateAccountAction, UpdateAccountForm } from './update-account-form';

export interface AccountSettingsSectionProps {
  title?: string;
  account: Account;
  updateAccountAction: UpdateAccountAction;
  updateAccountSubmitLabel?: string;
  changePasswordTitle?: string;
  changePasswordAction: ChangePasswordAction;
  changePasswordSubmitLabel?: string;
  confirmPasswordLabel?: string;
  currentPasswordLabel?: string;
  newPasswordLabel?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --account-settings-section-title-font-family: var(--font-family-heading);
 *   --account-settings-section-font-family: var(--font-family-heading);
 *   --account-settings-section-text: hsl(var(--foreground));
 *   --account-settings-section-border: hsl(var(--contrast-100));
 * }
 * ```
 */
export function AccountSettingsSection({
  title = 'Account Settings',
  account,
  updateAccountAction,
  updateAccountSubmitLabel,
  changePasswordTitle = 'Change Password',
  changePasswordAction,
  changePasswordSubmitLabel,
  confirmPasswordLabel,
  currentPasswordLabel,
  newPasswordLabel,
}: AccountSettingsSectionProps) {
  return (
    <section className="w-full @container">
      <header className="mb-8">
        <h1 className="font-[family-name:var(--account-settings-section-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none tracking-tight text-[var(--account-settings-section-title,hsl(var(--foreground)))] @xl:text-4xl">
          {title}
          <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
        </h1>
        <p className="mt-2 text-[var(--account-settings-description,hsl(var(--contrast-500)))]">
          Update your personal information and security settings
        </p>
      </header>
      
      <div className="grid gap-8 @xl:grid-cols-2">
        {/* Account Information Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-settings-section-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-8 transition-all duration-300 hover:border-[#F92F7B]/50 hover:shadow-lg">
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#F92F7B]/10 p-3">
                <div className="h-6 w-6 rounded-full bg-[#F92F7B]" />
              </div>
              <h2 className="font-[family-name:var(--account-settings-section-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-settings-section-text,var(--foreground))]">
                Personal Information
              </h2>
            </div>
            
            <UpdateAccountForm
              account={account}
              action={updateAccountAction}
              submitLabel={updateAccountSubmitLabel}
            />
          </div>
        </div>

        {/* Change Password Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--account-settings-section-border,hsl(var(--contrast-200)))] bg-[var(--account-card-background,hsl(var(--background)))] p-8 transition-all duration-300 hover:border-[#F92F7B]/50 hover:shadow-lg">
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5" />
          
          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#F92F7B]/10 p-3">
                <div className="h-6 w-6 rounded-full border-2 border-[#F92F7B]" />
              </div>
              <h2 className="font-[family-name:var(--account-settings-section-font-family,var(--font-family-heading))] text-xl font-extrabold text-[var(--account-settings-section-text,var(--foreground))]">
                {changePasswordTitle}
              </h2>
            </div>
            
            <ChangePasswordForm
              action={changePasswordAction}
              confirmPasswordLabel={confirmPasswordLabel}
              currentPasswordLabel={currentPasswordLabel}
              newPasswordLabel={newPasswordLabel}
              submitLabel={changePasswordSubmitLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
