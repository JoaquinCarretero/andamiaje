import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Playfair_Display } from "next/font/google"
import colors from "@/lib/colors"
import { ReduxProvider } from "@/store/provider"
import { AuthInitializer } from "@/components/auth/AuthInitializer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Andamiaje - Centro de Rehabilitación",
  description: "Sistema de gestión para terapeutas y coordinadores",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body
        style={{ backgroundColor: colors.background, color: colors.text }}
        className="font-sans antialiased min-h-screen"
      >
        <ReduxProvider>
          <AuthInitializer />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
