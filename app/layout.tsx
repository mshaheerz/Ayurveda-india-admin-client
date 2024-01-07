import type { Metadata } from 'next'
import './globals.css'
import "./data-tables-css.css";
import "./satoshi.css";

export const metadata: Metadata = {
  title: 'Admin AyurvedaIndia',
  description: 'admin Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} >{children}</body>
    </html>
  )
}
