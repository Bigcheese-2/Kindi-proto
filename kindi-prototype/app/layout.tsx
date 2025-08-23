import type { Metadata } from "next";
import "./globals.css";
import "./styles/themes.css";

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
      <body className="antialiased bg-background-primary text-text-primary" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
