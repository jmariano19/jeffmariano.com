import type { Metadata } from "next";
import { Playfair_Display, Roboto, Cormorant, Lato, Caveat } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeffmariano.com"),
  icons: {
    icon: [
      { url: "/images/fivicon.png", media: "(prefers-color-scheme: light)" },
      { url: "/images/fivicon-white.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/images/fivicon.png",
  },
  title: {
    default: "Jeff Mariano — AI Adoption & Agent Experience Design",
    template: "%s | Jeff Mariano",
  },
  description:
    "I help organizations implement AI that their teams and customers actually adopt, through behavioral design and micro-experimentation.",
  openGraph: {
    title: "Jeff Mariano — AI Adoption & Agent Experience Design",
    description:
      "I help organizations implement AI that their teams and customers actually adopt, through behavioral design and micro-experimentation.",
    url: "https://jeffmariano.com",
    siteName: "Jeff Mariano Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Mariano — AI Adoption & Agent Experience Design",
    description:
      "I help organizations implement AI that their teams and customers actually adopt, through behavioral design and micro-experimentation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${roboto.variable} ${cormorant.variable} ${lato.variable} ${caveat.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
