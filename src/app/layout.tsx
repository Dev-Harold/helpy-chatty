import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Techhelp | Quick, Easy, & Free Tech Support",
  description: "Quick, Easy, & Free Tech Support for ANY of your devices or problems.",
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
