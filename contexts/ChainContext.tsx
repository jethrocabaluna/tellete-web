import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { encode, decode } from 'base64-arraybuffer'

import { MESSAGE_RELAY_ABI, MESSAGE_RELAY_ADDRESS } from '../utils/constants'
import { MessageRelay } from '../types/ethers-contracts'
import { pemToArrayBuffer } from '../utils/pemToArrayBuffer'

type Context = {
  connectWallet: () => Promise<void>
  currentAccount?: string
  decryptMessage: (message: string) => Promise<string>
  deleteMessageFrom: (from: string) => Promise<boolean>
  encryptMessage: (message: string) => Promise<string>
  generateKeys: () => Promise<{
    keyPair: CryptoKeyPair
    pemPublicKey: string,
    pemPrivateKey: string,
    setPublicKeyOnChain: () => Promise<void>
    storeSessionKeys: (forUsername: string) => void
  }>
  getMessage: (from: string) => Promise<MessageRelay.MessageStructOutput | void>
  getPublicKey: (contactUsername: string) => Promise<string | void>
  hasKeys: boolean
  hasMessageFrom: (to: string) => Promise<boolean | void>
  hasMessageTo: (to: string) => Promise<boolean | void>
  lastSynced: Date
  register: (username: string) => Promise<void>
  sendMessage: (to: string, message: string) => Promise<string | void>
  setHasKeys: (value: boolean) => void
  updateLastSynced: () => void
  username?: string
}

type Props = {
  children: ReactNode
}

export const ChainContext = createContext<Context | undefined>(undefined)

const createContract = () => {
  if (!window.ethereum) return null
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(MESSAGE_RELAY_ADDRESS, MESSAGE_RELAY_ABI, signer) as MessageRelay
}

export const ChainProvider: FC<Props> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [username, setUsername] = useState('')
  const [hasKeys, setHasKeys] = useState(false)
  const [lastSynced, setLastSynced] = useState(new Date())

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    setHasKeys(!!Cookies.get(`${username}-public-key`) && !!Cookies.get(`${username}-private-key`))
  }, [username])

  const updateLastSynced = () => {
    setLastSynced(new Date())
  }

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install metamask')

    const { provider: ehtereumProvider } = new ethers.providers.Web3Provider(window.ethereum)

    // @ts-ignore: `on` does not exists in the ExternalProvider
    ehtereumProvider.on('accountsChanged', (accounts) => {
      setCurrentAccount(accounts[0])
      getUsername()
    })

    if (window.ethereum.request) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
      getUsername()
    }
  }

  const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey({
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
      true,
      ['encrypt', 'decrypt']
    )
    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const publicPemExported = `-----BEGIN PUBLIC KEY-----\n${encode(publicKeyBuffer)}\n-----END PUBLIC KEY-----`
    const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    const privatePemExported = `-----BEGIN PRIVATE KEY-----\n${encode(privateKeyBuffer)}\n-----END PRIVATE KEY-----`

    const setPublicKeyOnChain = async () => {
      const contract = createContract()
      if (contract) {
        try {
          const response = await contract.changeUserPublicKey(publicPemExported)
          await response.wait()
        } catch (err) {
          console.error(err)
        }
      }
    }

    const storeSessionKeys = (forUsername: string) => {
      Cookies.set(`${forUsername}-public-key`, publicPemExported)
      Cookies.set(`${forUsername}-private-key`, privatePemExported)
    }

    return {
      keyPair,
      pemPublicKey: publicPemExported,
      pemPrivateKey: privatePemExported,
      setPublicKeyOnChain,
      storeSessionKeys,
    }
  }

  const register = async (username: string) => {
    const contract = createContract()
    if (contract) {
      try {
        const { pemPublicKey, storeSessionKeys } = await generateKeys()
        const response = await contract.addUser(username, pemPublicKey)
        await response.wait(1)

        storeSessionKeys(username)
        setHasKeys(true)
        setUsername(username)
      } catch (err) {
        console.error(err)
      }

    }
  }

  const getPublicKey = async (contactUsername: string) => {
    const contract = createContract()
    if (contract) {
      try {
        return await contract.getPublicKey(contactUsername)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const getUsername = async () => {
    const contract = createContract()
    if (contract) {
      try {
        const result = await contract.getUsername()
        setUsername(result)
      } catch (err) {
        console.error(err)
        setUsername('')
      }
    }
  }

  const sendMessage = async (to: string, message: string) => {
    const contract = createContract()
    if (contract) {
      const contactPublicKeyString = await getPublicKey(to)
      let contactPublicKey: CryptoKey | null = null
      if (contactPublicKeyString) {
        contactPublicKey = await window.crypto.subtle.importKey(
          'spki',
          pemToArrayBuffer(contactPublicKeyString, 'public'),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          false,
          ['encrypt']
        )
      }
      if (contactPublicKey) {
        try {
          const encodedMessage = new TextEncoder().encode(message)
          const encryptedMessage = await window.crypto.subtle.encrypt({
            name: 'RSA-OAEP',
          },
            contactPublicKey,
            encodedMessage,
          )
          const messageString = String.fromCharCode.apply(null, new Uint8Array(encryptedMessage) as unknown as number[])
          const messageBase64 = window.btoa(messageString)
          const response = await contract.sendMessage(to, messageBase64)
          await response.wait()
          return messageBase64
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  const getMessage = async (from: string) => {
    const contract = createContract()
    if (contract) {
      try {
        const result = await contract.getMessage(from)
        return result
      } catch (err) {
        console.error(err)
      }
    }
  }

  const hasMessageTo = async (to: string) => {
    const contract = createContract()
    if (contract) {
      try {
        const result = await contract.hasMessageTo(to)
        return result
      } catch (err) {
        console.error(err)
      }
    }
  }

  const hasMessageFrom = async (from: string) => {
    const contract = createContract()
    if (contract) {
      try {
        const result = await contract.hasMessageFrom(from)
        return result
      } catch (err) {
        console.error(err)
      }
    }
  }

  const deleteMessageFrom = async (from: string) => {
    const contract = createContract()
    if (contract) {
      try {
        const response = await contract.deleteMessageFrom(from)
        await response.wait()
        return true
      } catch (err) {
        console.error(err)
      }
    }

    return false
  }

  const encryptMessage = async (message: string) => {
    const storedPublicKey = Cookies.get(`${username}-public-key`)
    if (storedPublicKey) {
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        pemToArrayBuffer(storedPublicKey, 'public'),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt']
      )
      const encryptedMessage = await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP',
      },
        publicKey,
        new TextEncoder().encode(message))
      return encode(encryptedMessage)
    }
    return ''
  }

  const decryptMessage = async (message: string) => {
    const storedPrivateKey = Cookies.get(`${username}-private-key`)
    if (storedPrivateKey) {
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(storedPrivateKey, 'private'),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['decrypt']
      )
      const decryptedMessage = await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP',
      },
        privateKey,
        decode(message))
      return new TextDecoder().decode(decryptedMessage)
    }
    return ''
  }

  return (
    <ChainContext.Provider value={{
      connectWallet,
      currentAccount,
      decryptMessage,
      deleteMessageFrom,
      encryptMessage,
      generateKeys,
      getMessage,
      getPublicKey,
      hasKeys,
      hasMessageFrom,
      hasMessageTo,
      lastSynced,
      register,
      sendMessage,
      setHasKeys,
      updateLastSynced,
      username,
    }}>
      {children}
    </ChainContext.Provider>
  )
}
