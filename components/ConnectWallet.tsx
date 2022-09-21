import React from 'react'
import useChainContext from '@/hooks/useChainContext'
import Button from './Button'

const ConnectWallet = () => {
  const { connectWallet } = useChainContext()

  return <Button title="Connect" onClick={connectWallet} />
}

export default ConnectWallet
