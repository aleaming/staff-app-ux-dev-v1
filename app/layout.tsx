import type { Metadata } from "next"
import { Adamina, Fira_Code } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { HapticProvider } from "@/components/haptic/HapticProvider"
import { LayoutClient } from "@/components/layout/LayoutClient"
import { DataProvider } from "@/lib/data/DataProvider"

// Zalando Sans is loaded via @import in globals.css

const adamina = Adamina({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "hosted Staff App",
  description: "Staff application for hosted property management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
          <HapticProvider>
            <DataProvider>
              <LayoutClient>{children}</LayoutClient>
            </DataProvider>
          </HapticProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
