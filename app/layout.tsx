
import type { Metadata } from 'next'
import './globals.css'
import "./data-tables-css.css";
import "./satoshi.css";
import { Providers } from './providers';
import { Provider } from './Provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
            <ToastContainer stacked />
          </Providers>
        </Provider>
      </body>

    </html>
  )
}
