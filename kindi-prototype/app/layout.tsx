import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntelAnalyzer - Intelligence Analysis Dashboard",
  description: "Multi-panel intelligence analysis dashboard with interactive visualizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
