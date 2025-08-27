import { AnimatedUnderline } from '@/vibes/soul/primitives/animated-underline';
import { Link } from '~/components/link';

import { SignInAction, SignInForm } from './sign-in-form';

interface Props {
  children?: React.ReactNode;
  title?: string;
  action: SignInAction;
  submitLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --sign-in-title-font-family: var(--font-family-heading);
 *   --sign-in-title: hsl(var(--foreground));
 * }
 * ```
 */
export function SignInSection({
  title = 'Sign In',
  children,
  action,
  submitLabel,
  emailLabel,
  passwordLabel,
  forgotPasswordHref = '/forgot-password',
  forgotPasswordLabel = 'Forgot your password?',
}: Props) {
  return (
    <div className="@container relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-[#F92F7B]" />
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-[#F92F7B]" />
        <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-[#F92F7B]" />
      </div>
      
      <div className="relative flex flex-col justify-center gap-y-12 px-3 py-10 @xl:flex-row @xl:gap-x-12 @xl:px-6 @4xl:py-20 @5xl:px-20">
        {/* Login Form Card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8 @xl:max-w-md">
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
          <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
          
          <div className="relative">
            <h1 className="mb-8 font-[family-name:var(--sign-in-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--sign-in-title,hsl(var(--foreground)))] @xl:text-4xl">
              {title}
              <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
            </h1>
            
            <SignInForm
              action={action}
              emailLabel={emailLabel}
              passwordLabel={passwordLabel}
              submitLabel={submitLabel}
            />
            
            <div className="mt-6">
              <Link className="group/underline focus:outline-none" href={forgotPasswordHref}>
                <AnimatedUnderline className="block w-fit text-sm font-semibold text-[var(--sign-in-link,hsl(var(--contrast-500)))] hover:text-[#F92F7B] transition-colors">
                  {forgotPasswordLabel}
                </AnimatedUnderline>
              </Link>
            </div>
          </div>
        </div>

        {/* Create Account Card */}
        <div className="flex w-full flex-col @xl:max-w-md">{children}</div>
      </div>
    </div>
  );
}
