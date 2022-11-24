import clsx from 'clsx'
import React, { useState } from 'react'
import useOuterClick from '@/hooks/useOuterClick'

const Instruction = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useOuterClick(() => {
    setIsOpen(false)
  })

  const dropdownClassName = clsx(
    'bg-primary-dark text-primary dark:bg-primary-light dark:text-primary-dark',
    'list-decimal w-full absolute top-full right-0 z-10 pl-6 pr-4 text-left',
  )

  return (
    <div ref={ref} className="relative w-96 flex flex-row-reverse p-2">
      <button className="text-base text-right" onClick={() => setIsOpen(!isOpen)}>Instructions</button>
      {
        isOpen && (
          <ol className={dropdownClassName}>
            <li className="mb-1">Connect your metamask account</li>
            <li className="mb-1">Sign-up with a unique username</li>
            <li className="mb-1">Accept signing the transaction for authorization and authentication purposes</li>
            <li className="mb-1">Copy the generated private key and save it somewhere safe (this will be like your password for your next sessions)</li>
            <li className="mb-1">Add contacts</li>
            <li className="mb-1">You can send/receive a message to/from a registered contact</li>
            <li className="mb-1">The message will only be received when the other user wants to receive it on their end by clicking the <strong>Get message</strong> from you</li>
            <li className="mb-1">The message will be deleted on the smart contract&apos;s state once it is received</li>
          </ol>
        )
      }
    </div>
  )
}

export default Instruction
