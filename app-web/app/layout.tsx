import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/caveat/500.css";
import "katex/dist/katex.min.css";
import "@/src/styles.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Mindspark",
  description: "Learn, practise and prove mastery across every subject you study.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Mindspark" },
};

export const viewport: Viewport = {
  themeColor: "#0c4dcc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
