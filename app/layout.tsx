import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Furniture Odyssey Operations",
  description: "Internal sales operations dashboard for Furniture Odyssey.",
  icons: {
    icon: [{ url: "/brand-mark.webp", type: "image/webp", sizes: "96x96" }],
    apple: [{ url: "/brand-mark.webp", sizes: "96x96" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
