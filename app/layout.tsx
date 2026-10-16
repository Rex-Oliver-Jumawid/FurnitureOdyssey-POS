import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Furniture Odyssey Operations",
  description: "Internal sales operations dashboard for Furniture Odyssey.",
  icons: {
    icon: [{ url: "/brand-mark.png", type: "image/png", sizes: "1277x1231" }],
    apple: [{ url: "/brand-mark.png", sizes: "1277x1231" }]
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
