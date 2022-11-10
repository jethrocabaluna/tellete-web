import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import Head from 'next/head'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import { ChainProvider } from '@/contexts/ChainContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type { AppRouter } from './api/trpc/[trpc]'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
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
      <Analytics />
    </>
  )
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`
    return {
      url,
      transformer: superjson,
    }
  },
  ssr: true,
})(MyApp)
