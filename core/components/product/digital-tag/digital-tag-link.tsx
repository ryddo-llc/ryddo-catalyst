import { Link } from '~/components/link';

interface DigitalTagLinkProps {
  productSlug: string;
  className?: string;
}

export function DigitalTagLink({ productSlug, className = '' }: DigitalTagLinkProps) {
  return (
    <Link
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-[#F92F7B] ${className} `}
      href={`/product/${productSlug}/tag`}
      title="View Digital Tag"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </Link>
  );
}
