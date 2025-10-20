import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VaelixBank - Votre banque digitale de confiance",
  description: "Application bancaire moderne et sécurisée pour gérer vos finances en toute simplicité",
  keywords: ["banque", "finance", "mobile", "digital", "paiement", "épargne"],
  authors: [{ name: "VaelixBank" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
