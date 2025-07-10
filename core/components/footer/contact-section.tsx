import React from 'react';
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';

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
          <span className="text-sm text-[var(--footer-section-description,hsl(var(--muted-foreground)))]">
            (555) 123-4567
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaEnvelope aria-hidden="true" className="text-[#333333]" />
          <span className="text-sm text-[var(--footer-section-description,hsl(var(--muted-foreground)))]">
            hello@ryddo.com
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FaMapMarkerAlt aria-hidden="true" className="text-[#333333]" />
          <span className="text-sm text-[var(--footer-section-description,hsl(var(--muted-foreground)))]">
            123 Electric Ave, Vancouver, BC V6B 2M9
          </span>
        </div>

        {/* Business Hours */}
        <div className="mt-4">
          <span className="mb-2 block font-semibold text-[var(--footer-section-title,hsl(var(--foreground)))]">
            Business Hours
          </span>
          <div className="space-y-1 text-sm text-[var(--footer-section-description,hsl(var(--muted-foreground)))]">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span>10:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-4">
          <span className="mb-2 block font-semibold text-[var(--footer-section-title,hsl(var(--foreground)))]">
            Follow Us
          </span>
          <div className="flex gap-3">
            <Link
              aria-label="Follow us on Instagram"
              className="text-[var(--footer-section-description,hsl(var(--muted-foreground)))] hover:text-[var(--footer-section-title,hsl(var(--foreground)))]"
              href="https://instagram.com/ryddo"
            >
              <FaInstagram className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Follow us on Facebook"
              className="text-[var(--footer-section-description,hsl(var(--muted-foreground)))] hover:text-[var(--footer-section-title,hsl(var(--foreground)))]"
              href="https://facebook.com/ryddo"
            >
              <FaFacebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
