import { createRouter } from '../createRouter'
import { userRouter } from './user'
import { messageRouter } from './message'

export const appRouter = createRouter().merge('user.', userRouter).merge('message.', messageRouter)

export type AppRouter = typeof appRouter
