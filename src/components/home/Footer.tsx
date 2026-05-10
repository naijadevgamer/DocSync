import Link from "next/link";
import React from "react";
import FullLogo from "../utils/FullLogo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/4 py-12">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="w-30">
          <FullLogo />
        </div>

        <p className="text-12-regular order-1 text-white/40 sm:order-0">
          © {new Date().getFullYear()} DocSync. All rights reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Contact Us", href: "/contact" },

            { name: "Admin Login", href: "/login?admin=true" },
          ].map((link, i) => (
            <Link
              key={String(i)}
              href={link.href}
              className="text-12-regular text-white/40 hover:text-white/50"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
