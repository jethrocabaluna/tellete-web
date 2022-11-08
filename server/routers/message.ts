import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { contract } from 'server/contract'
import { createRouter } from 'server/createRouter'
import { pusher } from 'server/pusher'

export const messageRouter = createRouter()
  .query('getMessage', {
    input: z.object({
      from: z.string(),
    }),
    resolve: async ({ input: { from }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const message = await contract.getMessage(ctx.user.address, from)
        return {
          content: message.content,
          createdAt: message.createdAt.toNumber(),
        }
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Sender with username "${from}" does not exist.`,
          })
        }
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoMessage') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No message found from "${from}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .query('hasMessageFrom', {
    input: z.object({
      from: z.string(),
    }),
    resolve: async ({ input: { from }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const hasMessage = await contract.hasMessageFrom(ctx.user.address, from)
        return hasMessage
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Sender with username "${from}" does not exist.`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .query('hasMessageTo', {
    input: z.object({
      to: z.string(),
    }),
    resolve: async ({ input: { to }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const hasMessage = await contract.hasMessageTo(ctx.user.address, to)
        return hasMessage
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Receiver with username "${to}" does not exist.`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .mutation('sendMessage', {
    input: z.object({
      to: z.string(),
      encryptedMessage: z.string(),
    }),
    resolve: async ({ input: { to, encryptedMessage }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const filter = contract.filters.MessageSent(ctx.user.address, to)
        contract.once(filter, (fromAddress, toUsername) => {
          console.log('triggered MessageSent')
          pusher.trigger(fromAddress.toLowerCase(), `message-sent-to-${toUsername}`, { fromAddress, toUsername })
        })
        const transaction = await contract.sendMessage(ctx.user.address, to, encryptedMessage)
        transaction.wait()
        return
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__InvalidMessage') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Message is invalid.',
          })
        }
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Receiver with username "${to}" does not exist.`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .mutation('deleteMessage', {
    input: z.object({
      from: z.string(),
    }),
    resolve: async ({ input: { from }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const filter = contract.filters.MessageDeleted(from, ctx.user.address)
        contract.once(filter, (fromUsername, toAddress) => {
          console.log('triggered MessageDeleted')
          pusher.trigger(toAddress.toLowerCase(), `message-deleted-from-${fromUsername}`, { fromUsername, toAddress })
        })
        const transaction = await contract.deleteMessageFrom(ctx.user.address, from)
        transaction.wait()
        return
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Sender with username "${from}" does not exist.`,
          })
        }
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoMessage') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No message found from "${from}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
