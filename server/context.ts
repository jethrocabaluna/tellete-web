import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { utils } from 'ethers'
import { contract } from './contract'

type UserData = {
  address?: string
  username?: string
}

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const cookiePublicAddress = opts?.req.cookies['public-address'] as string
  const signature = opts?.req.cookies['signature'] as string
  const recoveredPublicAddress = signature ? utils.verifyMessage('signature', signature) : '0x0'

  if (recoveredPublicAddress.toLowerCase() !== cookiePublicAddress?.toLowerCase()) return {}

  const cookieUsername = opts?.req.cookies['username'] as string
  let usernameFromAddress: string | undefined

  try {
    usernameFromAddress = await contract.getUsername(recoveredPublicAddress)
  } catch (err) {
    console.error(err)
  }

  if (cookieUsername && cookieUsername !== usernameFromAddress) return {}

  const user: UserData = {
    address: recoveredPublicAddress,
    username: usernameFromAddress,
  }

  return {
    user,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
