import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'primeicons/primeicons.css';
import {AuthProvider} from "./store/auth-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
          <AuthProvider>
              <Component {...pageProps} />
          </AuthProvider>
      )
}
