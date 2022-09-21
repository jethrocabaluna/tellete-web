import React from 'react'
import useChainContext from '@/hooks/useChainContext'
import GetNewKeys from './GetNewKeys'
import EnterKey from './EnterKey'
import CopyKey from './CopyKey'
import clsx from 'clsx'

const Header = () => {
  const { username, hasKeys } = useChainContext()

  return (
    <div className="py-3">
      <h2 className="text-4xl inline-block mr-2">{username}</h2>
      <div className="inline-block">
        <div className={clsx(
          'flex gap-2',
          !hasKeys && 'hidden'
        )}>
          <GetNewKeys />
          <CopyKey />
        </div>
        <div className={clsx(
          'inline',
          hasKeys && 'hidden'
        )}>
          <EnterKey />
        </div>
      </div>

    </div>
  )
}

export default Header
