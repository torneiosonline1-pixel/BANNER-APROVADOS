import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "JDES Banner Generator V6",
  description: "Banner Generator for Football Schools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
