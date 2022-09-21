import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChainProvider } from '../contexts/ChainContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ChainProvider>
        <Head>
          <title>
            Tellete
          </title>
        </Head>
        <Component {...pageProps} />
      </ChainProvider>
    </ThemeProvider>
  )
}

export default MyApp
