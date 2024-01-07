
import type { Metadata } from 'next'
import './globals.css'
import "./data-tables-css.css";
import "./satoshi.css";
import { Providers } from './providers';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body suppressHydrationWarning={true} >
        <Providers>
          {children}
        </Providers>
      </body>

    </html>
  )
}
