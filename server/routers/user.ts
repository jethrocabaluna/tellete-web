import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { contract } from 'server/contract'
import { createRouter } from 'server/createRouter'
import { pusher } from 'server/pusher'

export const userRouter = createRouter()
  .query('getUsername', {
    meta: {
      hasAuth: false,
    },
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
    meta: {
      hasAuth: false,
    },
    input: z.object({
      username: z.string(),
      pemPublicKey: z.string(),
    }),
    resolve: async ({ input: { username, pemPublicKey }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const filter = contract.filters.UserAdded(ctx.user.address)
        contract.once(filter, (userAddress) => {
          console.log('triggered UserAdded')
          pusher.trigger(userAddress.toLowerCase(), 'user-added', null)
        })
        const transaction = await contract.addUser(ctx.user.address, username, pemPublicKey)
        transaction.wait()
        return
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
      newPublicKey: z.string(),
    }),
    resolve: async ({ input: { newPublicKey }, ctx }) => {
      if (!ctx.user?.address) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        })
      }
      try {
        const filter = contract.filters.PublicKeyUpdated(ctx.user.address)
        contract.once(filter, (userAddress) => {
          console.log('triggered PublicKeyUpdated')
          pusher.trigger(userAddress.toLowerCase(), 'public-key-updated', null)
        })
        const transaction = await contract.changeUserPublicKey(ctx.user.address, newPublicKey)
        transaction.wait()
        return
      } catch (err) {
        if ((err as { errorName: string }).errorName === 'MessageRelay__NoUser') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No username with address "${ctx.user.address}"`,
          })
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong.',
      })
    },
  })
