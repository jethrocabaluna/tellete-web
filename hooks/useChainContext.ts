import { useContext } from 'react'
import { ChainContext } from '../contexts/ChainContext'

const useChainContext = () => {
  const context = useContext(ChainContext)

  if (!context) {
    throw new Error('No ChainContext.Provider found')
  }

  return context
}

export default useChainContext
