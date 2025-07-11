import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RO Patient Portal",
  description: "Portal de pacientes vinculado a Philips VueMotion",
    generator: 'Juan Cruz Morales - Radiográfica Oeste S.R.L.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark h-full">
        <body className={`${inter.className} h-screen overflow-y-auto bg-slate-900 text-white`}>
        {children}
      </body>
    </html>
  )
}
