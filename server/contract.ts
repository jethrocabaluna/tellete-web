import { ethers } from 'ethers'
import { MESSAGE_RELAY_ABI } from '@/utils/config'
import { MessageRelay } from '@/types/ethers-contracts'

export let contract: MessageRelay

if (process.env.NODE_ENV === 'production') {
  const provider = new ethers.providers.AlchemyProvider(process.env.NETWORK, process.env.ALCHEMY_API_KEY as string)
  const signer = new ethers.Wallet(process.env.SIGNER_KEY as string, provider)
  contract = new ethers.Contract(process.env.MESSAGE_RELAY_ADDRESS as string, MESSAGE_RELAY_ABI, signer) as MessageRelay
} else {
  const signer = new ethers.Wallet(process.env.SIGNER_KEY as string, ethers.getDefaultProvider('http://localhost:8545'))
  contract = new ethers.Contract(process.env.MESSAGE_RELAY_ADDRESS as string, MESSAGE_RELAY_ABI, signer) as MessageRelay
}
