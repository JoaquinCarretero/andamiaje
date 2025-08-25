import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import colors from "@/lib/colors"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Andamiaje - Centro de Rehabilitación",
  description: "Sistema de gestión para terapeutas y coordinadores",
   icons: {
    icon: "/favicon.ico", // o /logo.png
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      {/* Fondo general con el color definido en lib/colors.ts */}
      <body
        style={{ backgroundColor: colors.accent, color: colors.text }}
        className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  )
}
