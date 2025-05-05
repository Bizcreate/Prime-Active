import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MapTokenProvider } from "@/components/map-token-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MapTokenProvider>{children}</MapTokenProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
