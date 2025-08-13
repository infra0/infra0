import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import ClientLayoutWrapper from "@/components/client-layout-wrapper"
import GoogleAnalytics from "@/components/google-analytics"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Infra Cursor - Infrastructure as Code Generator",
  description: "Generate Pulumi infrastructure code with AI",
    generator: 'infra0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white antialiased`}>
        <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GA_ID || "G-VFN07TB8C7"} />
        <UserProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  )
}
