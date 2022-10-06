import { ethers } from 'ethers'
import { MESSAGE_RELAY_ABI, MESSAGE_RELAY_ADDRESS } from '@/utils/constants'
import { MessageRelay } from '@/types/ethers-contracts'

const signer = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  ethers.getDefaultProvider('http://localhost:8545')
)
export const contract = new ethers.Contract(MESSAGE_RELAY_ADDRESS, MESSAGE_RELAY_ABI, signer) as MessageRelay
