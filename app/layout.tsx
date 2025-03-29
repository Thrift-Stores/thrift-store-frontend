import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthModals } from "@/components/auth/auth-modals"
import { Providers } from "./providers"
import Header from "@/components/header/header"
import Footer from "@/components/footer/footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Thrift Store - Second-Hand Marketplace",
  description: "Buy and sell second-hand items",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header/>
          <Toaster richColors/>
          {children}
          <Footer/>
          <AuthModals />
        </Providers>
      </body>
    </html>
  )
}

