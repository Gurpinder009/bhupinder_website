import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";


export const metadata: Metadata = {
  title: "BHUPINDER — Digital Studio & Software Architecture",
  description:
    "Crafting timeless digital experiences, high-performance web platforms, and elegant software systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
