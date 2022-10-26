import React, { useState } from 'react'
import clsx from 'clsx'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'

const Register = () => {
  const { register, username: currentUsername } = useChainContext()
  const [username, setUsername] = useState(currentUsername ?? '')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    await register(username)
    setLoading(false)
  }

  return (
    <>
      <input
        className={clsx(
          'p-2 mx-auto w-full max-w-xs block transition-all',
          'bg-primary dark:bg-primary-dark',
          'border border-primary-dark dark:border-primary',
          'text-primary-dark dark:text-primary',
        )}
        type="text"
        placeholder="username"
        disabled={loading}
        onChange={e => setUsername(e.target.value)}
      />
      <div className="mt-2">
        <Button
          title="Register"
          solid
          disabled={loading}
          loading={loading}
          loadingTitle="Processing..."
          onClick={handleRegister}
        />
      </div>
    </>
  )
}

export default Register
