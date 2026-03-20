import type { Metadata } from "next";
import { Playfair_Display, Roboto, Cormorant, Lato } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://jeffmariano.com"),
  title: {
    default: "Jeff Mariano — Experience Designer",
    template: "%s | Jeff Mariano",
  },
  description:
    "I turn ignored AI tools into systems people actually use. Behavioral design, micro-experimentation, and methodology proven across retail, health, and digital ecosystems.",
  openGraph: {
    title: "Jeff Mariano — Experience Designer",
    description:
      "I turn ignored AI tools into systems people actually use. Behavioral design, micro-experimentation, and methodology proven across retail, health, and digital ecosystems.",
    url: "https://jeffmariano.com",
    siteName: "Jeff Mariano Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Mariano — Experience Designer",
    description:
      "I turn ignored AI tools into systems people actually use. Behavioral design, micro-experimentation, and methodology proven across retail, health, and digital ecosystems.",
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
        className={`${playfair.variable} ${roboto.variable} ${cormorant.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
