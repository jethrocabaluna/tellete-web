import React from 'react'
import { KeyIcon } from '@heroicons/react/24/solid'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'

const SignOperations = () => {
  const { storeSignature } = useChainContext()

  return <Button title="Sign operations" icon={KeyIcon} onClick={storeSignature} />
}

export default SignOperations
