import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { contract } from 'server/contract'
import { createRouter } from 'server/createRouter'

export const messageRouter = createRouter()
  .query('getMessage', {
    input: z.object({
      userAddress: z.string(),
      from: z.string(),
    }),
    resolve: async ({ input: { userAddress, from } }) => {
      try {
        const message = await contract.getMessage(userAddress, from)
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
      userAddress: z.string(),
      from: z.string(),
    }),
    resolve: async ({ input: { userAddress, from } }) => {
      try {
        const hasMessage = await contract.hasMessageFrom(userAddress, from)
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
      userAddress: z.string(),
      to: z.string(),
    }),
    resolve: async ({ input: { userAddress, to } }) => {
      try {
        const hasMessage = await contract.hasMessageTo(userAddress, to)
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
      userAddress: z.string(),
      to: z.string(),
      encryptedMessage: z.string(),
    }),
    resolve: async ({ input: { userAddress, to, encryptedMessage } }) => {
      try {
        const response = await contract.sendMessage(userAddress, to, encryptedMessage)
        await response.wait(1)
        return true
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
      userAddress: z.string(),
      from: z.string(),
    }),
    resolve: async ({ input: { userAddress, from } }) => {
      try {
        const response = await contract.deleteMessageFrom(userAddress, from)
        await response.wait(1)
        return true
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
