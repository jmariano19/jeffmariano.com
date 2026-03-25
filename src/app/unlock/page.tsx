"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

function UnlockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, from }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.redirect);
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
      <div className="px-6 md:px-12 pt-8">
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full bg-white border border-[#325624]/20 rounded-[10px] px-5 py-4 font-[family-name:var(--font-roboto)] text-[15px] text-[#25391d] placeholder:text-[#606060]/50 outline-none focus:border-[#325624]/60 transition-colors"
              />
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
