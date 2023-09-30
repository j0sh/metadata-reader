import './globals.css'
import { Inter } from 'next/font/google'
import GoogleAnalytics from "./GoogleAnalytics";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Transfix Metadata Reader',
  description: 'Read image metadata, by Transfix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_TRACKING_ID="G-6XNS6TFL9X" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
