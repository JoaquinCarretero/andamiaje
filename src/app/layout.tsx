import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/main-layout";
import { SearchProvider } from "@/context/SearchContext";

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
      <SearchProvider>
        <MainLayout>
        {children}
        </MainLayout>
        </SearchProvider>
      </body>
    </html>
  )
}

