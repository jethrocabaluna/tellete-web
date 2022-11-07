import { useContext } from 'react'
import { PusherContext } from '../contexts/PusherContext'

const usePusherContext = () => {
  const context = useContext(PusherContext)

  if (!context) {
    throw new Error('No PusherContext.Provider found')
  }

  return context
}

export default usePusherContext
