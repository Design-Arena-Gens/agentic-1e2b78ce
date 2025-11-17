import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { AppProvider, useApp } from '@/lib/store'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'InstaLite',
  description: 'A lightweight Instagram-like demo app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container-narrow pt-6 pb-12">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
