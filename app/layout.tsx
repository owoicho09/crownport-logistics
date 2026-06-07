import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Crownport Logistics — Global Courier Services',
    template: '%s | Crownport Logistics',
  },
  description:
    'Crownport Logistics delivers packages worldwide with speed and reliability. Track your shipment, get a quote, or schedule a pickup.',
  keywords: ['courier', 'logistics', 'shipping', 'tracking', 'global delivery'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://crownportlogistics.site'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0f1923]">{children}</body>
    </html>
  )
}
