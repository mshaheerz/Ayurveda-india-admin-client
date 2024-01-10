
import type { Metadata } from 'next'
import './globals.css'
import "./data-tables-css.css";
import "./satoshi.css";
import { Providers } from './providers';
import { Provider } from './Provider';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body suppressHydrationWarning={true} >
        <Provider>
        <Providers>
          {children}
        </Providers>
        </Provider>
      </body>

    </html>
  )
}
