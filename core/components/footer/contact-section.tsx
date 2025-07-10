import React from 'react';
import Link from 'next/link';
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';

type ContactInfopTypes = {
  type: string;
  value: string;
};
export default function ContactSection() {
  const contactInfo: ContactInfopTypes[] = [
    { type: 'phone', value: '(323) 676-7433' },
    { type: 'email', value: 'info@ryddo.com' },
    {
      type: 'address',
      value: '787 S Alameda St., Unit 120, Los Angeles, CA 90021',
    },
  ];
  return (
    <div className="pr-2">
      <span className="mb-3 block font-semibold text-[var(--footer-section-title,hsl(var(--foreground)))]">
        Find Us
      </span>
      
      <div className="space-y-3">
        {/* Phone */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaPhone className="text-[#333333]" aria-hidden="true" />
          <Link
            href="tel:+13236767433"
            className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
            title="Call Ryddo"
          >
            (323) 676-7433
          </Link>
        </div>

        {/* Email */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaEnvelope className="text-[#333333]" aria-hidden="true" />
          <Link
            href="mailto:info@ryddo.com"
            className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
            title="Email Ryddo"
          >
            info@ryddo.com
          </Link>
        </div>

        {/* Address */}
        <div className="flex items-start justify-center sm:justify-start gap-2">
          <FaMapMarkerAlt className="text-[#333333] mt-1" aria-hidden="true" />
          <address className="not-italic">
            <Link
              href="https://maps.google.com/?q=787+S+Alameda+St.,+Unit+120,+Los+Angeles,+CA+90021"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
              title="View Ryddo location on Google Maps"
            >
              787 S Alameda St., Unit 120<br />
              Los Angeles, CA 90021
            </Link>
          </address>
        </div>

        {/* Social Media */}
        <div className="flex justify-center sm:justify-start gap-3 pt-2">
          <Link
            href="https://instagram.com/ryddo"
            aria-label="Follow Ryddo on Instagram"
            title="Instagram"
            className="text-[#333333] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={18} aria-hidden="true" />
          </Link>
          <Link
            href="https://facebook.com/ryddo"
            aria-label="Follow Ryddo on Facebook"
            title="Facebook"
            className="text-[#333333] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
