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
    <div className="@container">
      <div className="flex flex-col justify-center gap-y-24 px-3 py-10 @xl:flex-row @xl:px-6 @4xl:py-20 @5xl:px-20">
        <div className="w-full @xl:max-w-md @xl:border-r @xl:pr-10 @4xl:pr-20">
          <h1 className="mb-10 font-[family-name:var(--sign-in-title-font-family,var(--font-family-heading))] text-4xl font-medium leading-none text-[var(--sign-in-title,hsl(var(--foreground)))] @xl:text-5xl">
            {title}
          </h1>
          <SignInForm
            action={action}
            emailLabel={emailLabel}
            passwordLabel={passwordLabel}
            submitLabel={submitLabel}
          />
          <Link className="group/underline focus:outline-none" href={forgotPasswordHref}>
            <AnimatedUnderline className="mt-4 block w-fit text-sm font-semibold">
              {forgotPasswordLabel}
            </AnimatedUnderline>
          </Link>
        </div>

        <div className="flex w-full flex-col @xl:max-w-md @xl:pl-10 @4xl:pl-20">{children}</div>
      </div>
    </div>
  );
}
