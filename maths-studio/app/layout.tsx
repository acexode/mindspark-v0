import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/caveat/500.css";
import "@/src/handwriting.css";
import "@/src/styles.css";
import "@/src/flow.css";
import "@/app/phase-zero.css";
import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/layout/service-worker-registration";
import { StudentProfileProvider } from "@/features/student-profile/profile-provider";
import { getServerProfile } from "@/features/learning/server/actions";

export const metadata: Metadata = {
  title: "Maths Studio — Mindspark",
  description: "Adaptive maths learning for secondary and university students.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Maths Studio" },
};

export const viewport: Viewport = {
  themeColor: "#0c4dcc",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialProfile = await getServerProfile();

  return (
    <html lang="en">
      <body>
        <StudentProfileProvider initialProfile={initialProfile}>
          <ServiceWorkerRegistration />
          {children}
        </StudentProfileProvider>
      </body>
    </html>
  );
}
