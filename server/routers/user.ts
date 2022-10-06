import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { contract } from 'server/contract'
import { createRouter } from 'server/createRouter'

export const userRouter = createRouter()
  .query('getUsername', {
    input: z.object({
      userAddress: z.string(),
    }),
    resolve: async ({ input: { userAddress } }) => {
      try {
        const username = await contract.getUsername(userAddress)
        return username
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No username with address "${userAddress}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .query('getPublicKey', {
    input: z.object({
      username: z.string(),
    }),
    resolve: async ({ input: { username } }) => {
      try {
        const publicKey = await contract.getPublicKey(username)
        return publicKey
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoPublicKey') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No publicKey with username "${username}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .mutation('register', {
    input: z.object({
      userAddress: z.string(),
      username: z.string(),
      pemPublicKey: z.string(),
    }),
    resolve: async ({ input: { userAddress, username, pemPublicKey } }) => {
      try {
        const response = await contract.addUser(userAddress, username, pemPublicKey)
        await response.wait(1)
        return true
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__InvalidUsername') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid username.',
          })
        }
        if ((err as { errorName: string }).errorName === 'MessageRelay__AddressAlreadyRegistered') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Already registered.',
          })
        }
        if ((err as { errorName: string }).errorName === 'MessageRelay__UsernameAlreadyExists') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username is already taken.',
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
  .mutation('changePublicKey', {
    input: z.object({
      userAddress: z.string(),
      newPublicKey: z.string(),
    }),
    resolve: async ({ input: { userAddress, newPublicKey } }) => {
      try {
        const response = await contract.changeUserPublicKey(userAddress, newPublicKey)
        await response.wait(1)
        return true
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No username with address "${userAddress}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })