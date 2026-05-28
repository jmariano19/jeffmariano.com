"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
];

interface NavProps {
  home?: boolean;
}

export default function Nav({ home = false }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative px-5 md:px-12 pt-6 md:pt-10 ${home ? "pb-2 md:pb-0" : "pb-6 md:pb-8"}`}
    >
      {/* Desktop nav */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-8 font-[family-name:var(--font-caveat)] text-base text-black">
          {links.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="relative hover:opacity-70 transition-opacity"
              >
                {label}
                {isActive && (
                  <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 40 5" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,3.5 C4,1.5 8,4 13,3 C18,2 22,4.5 27,3.5 C32,2.5 36,4 40,3" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
            );
          })}
        </div>

        {!home && (
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Logo size={85} rotateOuter />
          </Link>
        )}

        <a
          href="mailto:jmariano19@gmail.com"
          className="inline-flex items-center gap-1 font-[family-name:var(--font-caveat)] text-sm text-black hover:opacity-70 transition-opacity"
        >
          Get in touch
          <Image src="/images/arrow.svg" alt="" width={11} height={10} aria-hidden="true" />
        </a>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center justify-between">
        <button
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="flex flex-col justify-center gap-[5px] w-8 h-8"
          aria-label="Toggle menu"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
        >
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

        {home ? <div className="w-[60px]" /> : (
          <Link href="/">
            <Logo size={60} rotateOuter />
          </Link>
        )}

        <div className="w-8" />
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <motion.div
          id="mobile-navigation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 bg-cream z-50 px-5 py-6 border-b border-black/10 flex flex-col gap-4 font-[family-name:var(--font-caveat)] text-base text-black"
        >
          {links.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <hr className="border-black/10" />
          <a href="mailto:jmariano19@gmail.com" className="inline-flex items-center gap-1 text-sm text-gray-text hover:opacity-70 transition-opacity">
            Get in touch
            <Image src="/images/arrow.svg" alt="" width={11} height={10} aria-hidden="true" />
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
