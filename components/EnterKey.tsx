import React, { useState } from 'react'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import { KeyIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { pemToArrayBuffer } from '@/utils/pemToArrayBuffer'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'
import Modal from './Modal'
import { trpc } from '../utils/trpc'

const EnterKey = () => {
  const { username, setHasKeys } = useChainContext()
  const [isOpen, setIsOpen] = useState(false)
  const [enteredKey, setEnteredKey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const { data: storedPublicKey } = trpc.useQuery(
    ['user.getPublicKey', { username: username ?? '' }],
    { enabled: !!username, retry: (_, err) => err.data?.code !== 'NOT_FOUND' },
  )

  const onVerify = async () => {
    if (username) {
      const encoder = new TextEncoder()
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(enteredKey, 'private'),
        {
          name: 'RSA-PSS',
          hash: 'SHA-256',
        },
        false,
        ['sign']
      )

      const encoded = encoder.encode('secret')
      const signature = await window.crypto.subtle.sign(
        {
          name: 'RSA-PSS',
          saltLength: 32,
        },
        privateKey,
        encoded
      )

      if (storedPublicKey) {
        const publicKey = await window.crypto.subtle.importKey(
          'spki',
          pemToArrayBuffer(storedPublicKey, 'public'),
          {
            name: 'RSA-PSS',
            hash: 'SHA-256',
          },
          false,
          ['verify']
        )

        const result = await window.crypto.subtle.verify(
          {
            name: 'RSA-PSS',
            saltLength: 32,
          },
          publicKey,
          signature,
          encoded,
        )

        if (result) {
          Cookies.set(`${username}-public-key`, storedPublicKey)
          Cookies.set(`${username}-private-key`, enteredKey)
          setIsVerified(true)
          setHasKeys(true)
          return result
        }
      }
    }

    setErrorMessage('The key is not correct')
    return false
  }

  const onClose = () => {
    setIsVerified(false)
    setIsOpen(false)
    setErrorMessage('')
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="h-1 bg-primary-dark dark:bg-primary" />
        <div className="p-5">
          <h3>Enter your private key</h3>
          <p className="text-danger">You should not share your key to anyone</p>
          <textarea
            className={clsx(
              'resize-none text-primary-dark p-2',
              errorMessage && 'border border-danger',
              isVerified && 'border border-success',
            )}
            cols={30}
            rows={10}
            onChange={(e) => setEnteredKey(e.target.value)}
          ></textarea>
          {
            !!errorMessage && <p className="text-danger">{errorMessage}</p>
          }
          {
            !!isVerified && <p className="text-success">Verifed <CheckCircleIcon className="h-4 w-4 inline mb-1" /></p>
          }
          <div className="mt-5">
            <Button title="Close" onClick={onClose} />
            <Button title="Verify" onClick={onVerify} />
          </div>
        </div>
      </Modal>
      <Button title="Use key" size="xs" icon={KeyIcon} onClick={() => setIsOpen(true)} />
    </>
  )
}

export default EnterKey
