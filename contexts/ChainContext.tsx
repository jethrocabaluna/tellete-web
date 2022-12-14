import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { encode, decode } from 'base64-arraybuffer'

import { MESSAGE_RELAY_ABI } from '@/utils/config'
import { pemToArrayBuffer } from '@/utils/pemToArrayBuffer'
import { trpc } from '@/utils/trpc'
import { MessageRelay } from '@/types/ethers-contracts'

type Context = {
  connectWallet: () => Promise<void>
  currentAccount?: string
  decryptMessage: (message: string) => Promise<string>
  deleteMessageFrom: (from: string) => Promise<void>
  encryptMessage: (message: string) => Promise<string>
  generateKeys: () => Promise<{
    keyPair: CryptoKeyPair
    pemPublicKey: string,
    pemPrivateKey: string,
    storeSessionKeys: (forUsername: string) => void
  }>
  hasKeys: boolean
  isLoading: boolean
  lastSynced: Date
  register: (username: string) => Promise<void>
  sendMessage: (to: string, message: string, publicKey: string) => Promise<string | void>
  setHasKeys: (value: boolean) => void
  signature?: string
  storeSignature: () => Promise<void>
  updateLastSynced: () => void
  username?: string
}

type Props = {
  children: ReactNode
}

export const ChainContext = createContext<Context | undefined>(undefined)

export const createContract = () => {
  if (!window.ethereum) return null
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(process.env.NEXT_PUBLIC_MESSAGE_RELAY_ADDRESS as string, MESSAGE_RELAY_ABI, signer) as MessageRelay
}

export const ChainProvider: FC<Props> = ({ children }) => {
  const [signature, setSignature] = useState(Cookies.get('signature'))
  const [currentAccount, setCurrentAccount] = useState('')
  const [username, setUsername] = useState('')
  const [hasKeys, setHasKeys] = useState(false)
  const [lastSynced, setLastSynced] = useState(new Date())
  const { data: queriedUsername, isLoading } = trpc.useQuery(
    ['user.getUsername', { userAddress: currentAccount }],
    {
      enabled: !!currentAccount,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
  const { mutateAsync: registerMutation } = trpc.useMutation(['user.register'])
  const { mutateAsync: sendMessageMutation } = trpc.useMutation(['message.sendMessage'])
  const { mutateAsync: deleteMessageMutation } = trpc.useMutation(['message.deleteMessage'])

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    setUsername(queriedUsername ?? '')
    if (queriedUsername) {
      Cookies.set('username', queriedUsername)
    } else {
      Cookies.remove('username')
    }
  }, [queriedUsername])

  useEffect(() => {
    setHasKeys(!!Cookies.get(`${username}-public-key`) && !!Cookies.get(`${username}-private-key`))
  }, [username])

  const updateLastSynced = () => {
    setLastSynced(new Date())
  }

  const storeSignature = async () => {
    if (!window.ethereum) return
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const signature = await signer.signMessage('signature')
    Cookies.set('signature', signature)
    setSignature(signature)
  }

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install metamask')

    const { provider: ehtereumProvider } = new ethers.providers.Web3Provider(window.ethereum)

    // @ts-ignore: `on` does not exists in the ExternalProvider
    ehtereumProvider.on('accountsChanged', async (accounts) => {
      setSignature(undefined)
      Cookies.remove('signature')
      if (window.ethereum) {
        Cookies.set('public-address', accounts[0])
        setCurrentAccount(accounts[0])
      }
    })

    if (window.ethereum.request) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      Cookies.set('public-address', accounts[0])
      setCurrentAccount(accounts[0])
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

    const storeSessionKeys = (forUsername: string) => {
      Cookies.set(`${forUsername}-public-key`, publicPemExported)
      Cookies.set(`${forUsername}-private-key`, privatePemExported)
    }

    return {
      keyPair,
      pemPublicKey: publicPemExported,
      pemPrivateKey: privatePemExported,
      storeSessionKeys,
    }
  }

  const register = async (username: string) => {
    const contract = createContract()
    if (!contract) return
    try {
      const { pemPublicKey, storeSessionKeys } = await generateKeys()
      await storeSignature()
      const filter = contract.filters.UserAdded(currentAccount)
      contract.once(filter, () => {
        console.log('triggered UserAdded in FE')
        storeSessionKeys(username)
        setHasKeys(true)
        setUsername(username)
        Cookies.set('username', username)
      })
      await registerMutation({ username, pemPublicKey })
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async (to: string, message: string, contactPublicKeyString: string) => {
    if (hasKeys && currentAccount) {
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
          await sendMessageMutation({
            to,
            encryptedMessage: messageBase64,
          })
          return messageBase64
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  const deleteMessageFrom = async (from: string) => {
    if (currentAccount) {
      try {
        await deleteMessageMutation({
          from,
        })
        return
      } catch (err) {
        console.error(err)
      }
    }
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
      hasKeys,
      isLoading,
      lastSynced,
      register,
      sendMessage,
      setHasKeys,
      signature,
      storeSignature,
      updateLastSynced,
      username,
    }}>
      {children}
    </ChainContext.Provider>
  )
}
