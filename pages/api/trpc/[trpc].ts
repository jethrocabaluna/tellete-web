import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from 'server/routers/_app'
import { createContext } from 'server/context'
import { NextApiHandler } from 'next'

export type AppRouter = typeof appRouter

const allowCors =
  (fn: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }

export default allowCors(
  trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
    onError: ({ error }) => {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Something went wrong', error)
      }
    },
  })
)
