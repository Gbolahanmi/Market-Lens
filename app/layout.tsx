import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";
import { ToastProvider } from "@/context/ToastContext";
import { NewsProvider } from "@/context/NewsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Lens",
  description:
    "Get real stock prices, get personalized alerts, and explore detailed company information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NewsProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </NewsProvider>
      </body>
    </html>
  );
}
