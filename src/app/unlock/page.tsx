"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

function UnlockForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim(), from }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.assign(data.redirect);
      } else {
        setError("Incorrect password. Try again.");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4e9] flex flex-col">
      {/* Nav */}
      <div className="pt-8 flex justify-center">
        <Logo />
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[420px]">
          {/* Lock icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#325624]/20 flex items-center justify-center">
              <svg
                width="22"
                height="26"
                viewBox="0 0 22 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 11V8C18 4.13 14.87 1 11 1C7.13 1 4 4.13 4 8V11"
                  stroke="#325624"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="1"
                  y="11"
                  width="20"
                  height="14"
                  rx="3"
                  stroke="#325624"
                  strokeWidth="1.8"
                />
                <circle cx="11" cy="18" r="2" fill="#325624" />
              </svg>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[34px] font-bold leading-[1.2] text-[#325624] text-center mb-3">
            Protected Work
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[15px] leading-[1.7] text-[#606060] text-center mb-10">
            This case study is password protected.
            <br />
            Enter the password to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full bg-white border border-[#325624]/20 rounded-[10px] pl-5 pr-14 py-4 font-[family-name:var(--font-roboto)] text-[15px] text-[#25391d] placeholder:text-[#606060]/50 outline-none focus:border-[#325624]/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((isVisible) => !isVisible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-4 flex items-center justify-center text-[#606060] hover:text-[#325624] transition-colors"
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M10.58 10.59A2 2 0 0013.41 13.42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M9.9 5.1A10.67 10.67 0 0112 4.88c5.5 0 9 7.12 9 7.12a15.55 15.55 0 01-3.18 3.73M6.18 6.27C4.12 7.75 3 12 3 12s3.5 7.12 9 7.12a10.6 10.6 0 003.1-.47" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 12s3.5-7.12 9-7.12S21 12 21 12s-3.5 7.12-9 7.12S3 12 3 12z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="font-[family-name:var(--font-roboto)] text-[13px] text-red-600 text-center -mt-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#325624] text-white font-[family-name:var(--font-roboto)] font-bold text-[15px] py-4 rounded-[10px] hover:bg-[#25391d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Unlock"}
            </button>
          </form>

          <p className="font-[family-name:var(--font-roboto)] text-[13px] text-[#606060]/60 text-center mt-8">
            Don&apos;t have the password?{" "}
            <a
              href="mailto:jmariano19@gmail.com"
              className="text-[#325624] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense>
      <UnlockForm />
    </Suspense>
  );
}
