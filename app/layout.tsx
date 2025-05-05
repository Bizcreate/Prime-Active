import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Web3Provider } from "@/components/web3-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "Prime Active",
  description: "Prime Active - Action Sports Community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Web3Provider>
              {children}
              <Toaster />
            </Web3Provider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
