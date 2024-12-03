import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cervêsïa",
  description: "Cervêsïa es una aplicación web que permite a los usuarios registrarse y comprar comida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className="font-sans">
        {children}
      </body>
    </html>
  )
}

