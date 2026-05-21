import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Interview Assistant",
  description: "AI powered ATS and interview analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
