import * as trpc from '@trpc/server'
import { Context } from './context'

interface Meta {
  hasAuth: boolean
}

export const createRouter = () => {
  return trpc.router<Context, Meta>()
}
