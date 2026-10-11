import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Snippet Vault",
  description: "Store, organize and AI-enhance your developer snippets."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
