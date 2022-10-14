import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { withStopPropagation } from '@/utils/event'
import { TrashIcon } from '@heroicons/react/24/solid'
import useChainContext from '@/hooks/useChainContext'
import { trpc } from '../utils/trpc'

type Props = {
  active?: boolean
  contactUsername: string
  onClick: (username: string) => void
  onRemove: (username: string) => void
}

const Contact = ({
  active,
  contactUsername,
  onClick,
  onRemove,
}: Props) => {
  const { lastSynced } = useChainContext()
  const [hasMessage, setHasMessage] = useState(false)
  const { refetch: hasMessageFrom } = trpc.useQuery(
    ['message.hasMessageFrom', { from: contactUsername }],
    {
      enabled: false,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
      onSuccess: (data) => {
        setHasMessage(data)
      },
    },
  )

  const initialize = async () => {
    const newHasMessage = (await hasMessageFrom()).data
    setHasMessage(!!newHasMessage)
  }

  useEffect(() => {
    initialize()
  }, [lastSynced])
  return (
    <div
      className={clsx(
        'm-1 p-2 relative border transition-colors',
        'border-primary-dark dark:border-primary',
        'hover:bg-primary-dark dark:hover:bg-primary',
        'hover:text-primary dark:hover:text-primary-dark',
        active && 'bg-primary-dark dark:bg-primary text-primary dark:text-primary-dark',
      )}
      onClick={() => onClick(contactUsername)}
    >
      <p className={clsx(
        'text-lg',
        hasMessage && 'font-black',
      )}>{contactUsername}</p>
      <TrashIcon
        className="h-4 w-4 m-2 text-danger cursor-pointer absolute bottom-0 right-0"
        onClick={(e) => withStopPropagation(e, () => onRemove(contactUsername))}
      />
      {hasMessage && (
        <span className="flex h-3 w-3 absolute -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
      )}
    </div>
  )
}

export default Contact
