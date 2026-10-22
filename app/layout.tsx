import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticolandia | Reforma e prestações",
  description: "Gastos da reforma, prestações pagas e saldo a pagar em um só lugar.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

