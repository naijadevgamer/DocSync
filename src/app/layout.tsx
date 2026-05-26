import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),

  title: {
    default: "DocSync",
    template: "%s | DocSync",
  },

  description:
    "A healthcare patient management system for appointments, patient records, and healthcare administration.",

  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },

  openGraph: {
    siteName: "DocSync",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "bg-dark-300 min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <main>{children}</main>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
