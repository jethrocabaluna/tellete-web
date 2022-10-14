import superjson from 'superjson'
import { TRPCError } from '@trpc/server'
import { createRouter } from '../createRouter'
import { userRouter } from './user'
import { messageRouter } from './message'

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ meta = { hasAuth: true }, ctx, next }) => {
    if (meta.hasAuth && !ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next()
  })
  .merge('user.', userRouter)
  .merge('message.', messageRouter)

export type AppRouter = typeof appRouter
