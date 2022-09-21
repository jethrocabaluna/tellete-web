import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'
import clsx from 'clsx'

const CopyKey = () => {
  const { username } = useChainContext()
  const storedPrivateKey = Cookies.get(`${username}-private-key`)
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    if (storedPrivateKey) {
      navigator.clipboard.writeText(storedPrivateKey)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <div className="flex gap-1 items-center">
      <Button title="Copy key" size="xs" icon={DocumentDuplicateIcon} onClick={onCopy} />
      <CheckCircleIcon
        className={clsx(
          'text-success h-4 w-4 inline transition-opacity',
          isCopied && 'opacity-100',
          !isCopied && 'opacity-0',
        )}
      />
    </div>
  )
}

export default CopyKey
