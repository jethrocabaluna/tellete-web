import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import type { AppRouter } from './api/trpc/[trpc]'
import { ChainProvider } from '../contexts/ChainContext'
import { ThemeProvider } from '../contexts/ThemeContext'

const MyApp = ({ Component, pageProps }: AppProps) => {
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

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.NEXT_PUBLIC_API_URL as string
    return {
      url,
      transformer: superjson,
    }
  },
  ssr: true,
})(MyApp)
