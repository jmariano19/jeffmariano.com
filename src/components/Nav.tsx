"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative px-5 md:px-12 pt-6 md:pt-10 pb-6 md:pb-8"
    >
      {/* Desktop nav */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-8 font-[family-name:var(--font-lato)] text-sm text-black">
          {links.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className="relative hover:opacity-70 transition-opacity">
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-black" />
                )}
              </Link>
            );
          })}
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Logo size={85} />
        </Link>

        <p className="font-[family-name:var(--font-lato)] text-sm text-black text-right">
          Get in touch to view work:
          <br />
          <a href="mailto:jmariano19@gmail.com" className="hover:opacity-70">
            jmariano19@gmail.com
          </a>
        </p>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col justify-center gap-[5px] w-8 h-8"
          aria-label="Toggle menu"
        >
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

        <Link href="/">
          <Logo size={60} />
        </Link>

        <div className="w-8" />
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 bg-cream z-50 px-5 py-6 border-b border-black/10 flex flex-col gap-4 font-[family-name:var(--font-lato)] text-base text-black"
        >
          {links.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <hr className="border-black/10" />
          <a href="mailto:jmariano19@gmail.com" className="text-sm text-gray-text">
            jmariano19@gmail.com
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
