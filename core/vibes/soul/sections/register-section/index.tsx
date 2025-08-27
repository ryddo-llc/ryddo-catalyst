import { clsx } from 'clsx';

import { DynamicForm, DynamicFormAction } from '@/vibes/soul/form/dynamic-form';
import { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { Link } from '~/components/link';

interface Props<F extends Field> {
  title?: string;
  subtitle?: string;
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
  className?: string;
  loginHref?: string;
  loginLabel?: string;
}

export function RegisterSection<F extends Field>({
  className,
  title = 'Create Account',
  subtitle,
  fields,
  submitLabel = 'Create Account',
  action,
  loginHref = '/login',
  loginLabel = 'Already have an account? Sign in',
}: Props<F>) {
  return (
    <div className={clsx('@container relative overflow-hidden', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-[#F92F7B]" />
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-[#F92F7B]" />
        <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-[#F92F7B]" />
      </div>
      
      <div className="relative flex flex-col justify-center gap-y-12 px-3 py-10 @xl:flex-row @xl:gap-x-12 @xl:px-6 @4xl:py-20 @5xl:px-20">
        {/* Registration Form Card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8 @xl:max-w-2xl">
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
          <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
          
          <div className="relative">
            <h1 className="mb-2 font-[family-name:var(--register-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--register-title,hsl(var(--foreground)))] @xl:text-4xl">
              {title}
              <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
            </h1>
            
            {subtitle != null && subtitle !== '' && (
              <p className="mb-8 text-base font-light leading-none text-[var(--register-subtitle,hsl(var(--contrast-500)))] @xl:text-lg">
                {subtitle}
              </p>
            )}
            
            <div className="[&_button[type=submit]]:w-full [&_button[type=submit]]:bg-[#F92F7B] [&_button[type=submit]]:hover:bg-[#d41f63] [&_button[type=submit]]:border-[#F92F7B] [&_button[type=submit]]:hover:border-[#d41f63] [&_button[type=submit]]:text-white [&_button[type=submit]]:font-bold [&_button[type=submit]]:font-['Inter'] [&_button[type=submit]]:leading-normal [&_button[type=submit]]:tracking-wide [&_button[type=submit]]:rounded-[50px] [&_button[type=submit]]:shadow-[0px_12px_18px_-6px_rgba(0,0,0,0.12)] [&_button[type=submit]]:hover:shadow-lg [&_button[type=submit]]:transition-all [&_button[type=submit]]:duration-200 [&_button[type=submit]]:active:scale-95 [&_button[type=submit]]:min-h-[48px] [&_button[type=submit]]:overflow-hidden">
              <DynamicForm 
                action={action} 
                fields={fields} 
                submitLabel={submitLabel}
              />
            </div>
            
            <div className="mt-6 text-center">
              <Link className="group/underline focus:outline-none" href={loginHref}>
                <span className="block w-fit text-sm font-semibold text-[var(--register-link,hsl(var(--contrast-500)))] hover:text-[#F92F7B] transition-colors">
                  {loginLabel}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="flex w-full flex-col @xl:max-w-md">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F92F7B]/10 to-[#F92F7B]/5 p-8">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#F92F7B]/20" />
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#F92F7B]/15" />
            
            <h2 className="mb-6 font-[family-name:var(--register-benefits-title-font-family,var(--font-family-heading))] text-3xl font-extrabold leading-none text-[var(--register-benefits-title,hsl(var(--foreground)))] @xl:text-4xl">
              Join Ryddo
              <span className="ml-2 text-4xl text-[#F92F7B] @xl:text-5xl">.</span>
            </h2>
            <div className="text-[var(--register-benefits-description,hsl(var(--contrast-500)))]">
              <p className="mb-6 text-base font-medium">Unlock exclusive benefits when you create your account:</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Fast & secure checkout process</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Multiple shipping addresses</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Complete order history & tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Personalized wishlists</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F92F7B]" />
                  <span className="text-sm font-medium">Exclusive member offers & updates</span>
                </li>
              </ul>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--register-security-text,hsl(var(--contrast-400)))]">
                  🔒 Your information is secure and protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}