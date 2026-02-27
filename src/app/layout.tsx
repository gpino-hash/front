import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Profesio - Find Trusted Professionals",
  description: "Find and book trusted professionals for any service. Plumbing, electrical, cleaning, painting, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="js-focus-visible" data-js-focus-visible="">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background-light text-slate-900`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
