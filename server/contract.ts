import Pusher from 'pusher'
import { ethers } from 'ethers'
import { MESSAGE_RELAY_ABI } from '@/utils/config'
import { MessageRelay } from '@/types/ethers-contracts'

export let contract: ethers.Contract

if (process.env.NODE_ENV === 'production') {
  const provider = new ethers.providers.AlchemyProvider(process.env.NETWORK, process.env.ALCHEMY_API_KEY as string)
  const signer = new ethers.Wallet(process.env.SIGNER_KEY as string, provider)
  contract = new ethers.Contract(process.env.MESSAGE_RELAY_ADDRESS as string, MESSAGE_RELAY_ABI, signer) as MessageRelay
} else {
  const signer = new ethers.Wallet(process.env.SIGNER_KEY as string, ethers.getDefaultProvider('http://localhost:8545'))
  contract = new ethers.Contract(process.env.MESSAGE_RELAY_ADDRESS as string, MESSAGE_RELAY_ABI, signer) as MessageRelay
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
  useTLS: true,
})

if (contract) {
  contract.on('UserAdded', (userAddress: string) => {
    pusher.trigger(userAddress.toLowerCase(), 'user-added', null)
  })

  contract.on('MessageSent', (fromAddress: string, toUsername: string) => {
    pusher.trigger(fromAddress.toLowerCase(), `message-sent-to-${toUsername}`, { fromAddress, toUsername })
  })

  contract.on('MessageDeleted', (fromUsername: string, toAddress: string) => {
    pusher.trigger(toAddress.toLowerCase(), `message-deleted-from-${fromUsername}`, { fromUsername, toAddress })
  })

  contract.on('PublicKeyUpdated', (userAddress: string) => {
    pusher.trigger(userAddress.toLowerCase(), 'public-key-updated', null)
  })
}
