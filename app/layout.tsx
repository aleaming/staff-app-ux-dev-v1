import type { Metadata } from "next";
import { Adamina, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopNav } from "@/components/navigation/TopNav";
import { FixedSearchBar } from "@/components/navigation/FixedSearchBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DamagesNotificationBanner } from "@/components/homes/DamagesNotificationBanner";
import { Toaster } from "sonner";

// Zalando Sans is loaded via @import in globals.css

const adamina = Adamina({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "onefinestay Staff App",
  description: "Staff application for onefinestay property management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${adamina.variable} ${firaCode.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          <FixedSearchBar />
          <DamagesNotificationBanner />
          <main className="flex-1 pb-48 md:pb-48">
            {children}
          </main>
          <BottomNav />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

