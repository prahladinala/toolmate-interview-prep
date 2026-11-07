import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://interview.toolmate.co.in/"),
  title: {
    template: "%s | ToolMate Interview Prep",
    default: "Interview Preparation by ToolMate",
  },
  description: "Master Technical Interviews with Confidence. Learn Javascript, TypeScript, React, Next.js, and System Design.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Interview Preparation by ToolMate",
    description: "Master Technical Interviews with Confidence. Learn Javascript, TypeScript, React, Next.js, and System Design.",
    url: "https://interview.toolmate.co.in/",
    siteName: "ToolMate Interview Prep",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Preparation by ToolMate",
    description: "Master Technical Interviews with Confidence.",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolMate Interview Prep",
  "url": "https://interview.toolmate.co.in/",
  "description": "Master Technical Interviews with Confidence.",
  "publisher": {
    "@type": "Organization",
    "name": "ToolMate"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-primary selection:text-primary-foreground`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
