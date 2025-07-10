import React from 'react';
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

import { Link } from '~/components/link';

export default function ContactSection() {
  return (
    <div className="pr-2">
      <span className="mb-3 block font-semibold text-[var(--footer-section-title,hsl(var(--foreground)))]">
        Find Us
      </span>
      
      <div className="space-y-3">
        {/* Phone */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaPhone aria-hidden="true" className="text-[#333333]" />
          <Link
            className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
            href="tel:+13236767433"
            title="Call Ryddo"
          >
            (323) 676-7433
          </Link>
        </div>

        {/* Email */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaEnvelope aria-hidden="true" className="text-[#333333]" />
          <Link
            className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
            href="mailto:info@ryddo.com"
            title="Email Ryddo"
          >
            info@ryddo.com
          </Link>
        </div>

        {/* Address */}
        <div className="flex items-start justify-center sm:justify-start gap-2">
          <FaMapMarkerAlt aria-hidden="true" className="text-[#333333] mt-1" />
          <address className="not-italic">
            <Link
              className="text-sm font-medium text-[var(--footer-link,hsl(var(--contrast-500)))] ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
              href="https://maps.google.com/?q=787+S+Alameda+St.,+Unit+120,+Los+Angeles,+CA+90021"
              rel="noopener noreferrer"
              target="_blank"
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
            aria-label="Follow Ryddo on Instagram"
            className="text-[#333333] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))]"
            href="https://instagram.com/ryddo"
            rel="noopener noreferrer"
            target="_blank"
            title="Instagram"
          >
            <FaInstagram aria-hidden="true" size={18} />
          </Link>
          <Link
            aria-label="Follow Ryddo on Facebook"
            className="text-[#333333] transition-colors duration-300 hover:text-[var(--footer-link-hover,hsl(var(--foreground)))]"
            href="https://facebook.com/ryddo"
            rel="noopener noreferrer"
            target="_blank"
            title="Facebook"
          >
            <FaFacebook aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
