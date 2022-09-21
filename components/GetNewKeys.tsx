import React, { useState } from 'react'
import { KeyIcon, DocumentDuplicateIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'
import Modal from './Modal'
import clsx from 'clsx'
import { InboxItem } from '@/types/common'
import { encode } from 'base64-arraybuffer'

const GetNewKeys = () => {
  const { generateKeys, username, decryptMessage } = useChainContext()
  const [isOpen, setIsOpen] = useState(false)
  const [newPrivateKey, setNewPrivateKey] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const onGetNewKeys = async () => {
    if (username) {
      const { pemPrivateKey, keyPair, setPublicKeyOnChain, storeSessionKeys } = await generateKeys()

      await setPublicKeyOnChain()
      await changeContactsInboxKey(keyPair.publicKey)
      storeSessionKeys(username)
      setNewPrivateKey(pemPrivateKey)
    }
  }

  const changeContactsInboxKey = async (key: CryptoKey) => {
    const contacts: string[] = JSON.parse(localStorage.getItem(`${username}-contacts`) ?? '[]')
    for (const contact of contacts) {
      const inbox: InboxItem[] = JSON.parse(localStorage.getItem(`${username}-${contact}-inbox`) ?? '[]')
      for (const chat of inbox) {
        const decryptedMessage = await decryptMessage(chat.content)
        try {
          const encodedMessage = new TextEncoder().encode(decryptedMessage)
          const encryptedMessage = await window.crypto.subtle.encrypt({
            name: 'RSA-OAEP',
          },
            key,
            encodedMessage,
          )
          chat.content = encode(encryptedMessage)
        } catch (err) {
          console.error(err)
        }
      }
      localStorage.setItem(`${username}-${contact}-inbox`, JSON.stringify(inbox))
    }
  }

  const onClose = () => {
    setIsOpen(false)
    setNewPrivateKey('')
    setIsCopied(false)
  }

  const onCopy = () => {
    if (newPrivateKey) {
      navigator.clipboard.writeText(newPrivateKey)
      setIsCopied(true)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="h-1 bg-primary-dark dark:bg-primary" />
        <div className="p-5">
          {
            newPrivateKey ? (
              <>
                <h3 className="text-danger mb-2">Save the new key</h3>
                <p
                  className={clsx(
                    'border border-primary-dark dark:border-primary cursor-pointer',
                    'text-ellipsis overflow-hidden max-w-xs relative p-2',
                  )}
                  onClick={onCopy}
                >
                  {newPrivateKey}
                  <span className="absolute left-0 top-0 w-full h-full bg-primary-light-overlay dark:bg-primary-dark-overlay">
                    <DocumentDuplicateIcon className="h-6 w-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </span>
                </p>
                {isCopied && <p className="text-success mt-2">Copied <CheckCircleIcon className="h-4 w-4 inline mb-1" /></p>}
              </>
            ) : (
              <>
                <h3>Do you want to get a new key?</h3>
                <p className="text-danger">You should not share your key to anyone</p>
              </>
            )
          }
          <div className="flex flex-row-reverse mt-5">
            <div className="flex gap-5">
              {
                newPrivateKey ? (
                  <Button title="Close" onClick={onClose} />
                ) : (
                  <>
                    <Button title="No" onClick={() => setIsOpen(false)} />
                    <Button title="Yes" onClick={onGetNewKeys} />
                  </>
                )
              }
            </div>
          </div>
        </div>
      </Modal>
      <Button title="Get new keys" size="xs" icon={KeyIcon} onClick={() => setIsOpen(true)} />
    </>
  )
}

export default GetNewKeys
