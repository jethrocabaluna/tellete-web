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

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`
    return {
      url,
      transformer: superjson,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }
  },
  ssr: true,
})(MyApp)
