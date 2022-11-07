import { useState, createContext, ReactNode, FC, useEffect } from 'react'
import Pusher, { Channel } from 'pusher-js'
import useChainContext from '@/hooks/useChainContext'

type Context = {
  channel?: Channel
}

type Props = {
  children: ReactNode
}

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
})

export const PusherContext = createContext<Context | undefined>(undefined)

export const PusherProvider: FC<Props> = ({ children }) => {
  const { currentAccount } = useChainContext()
  const [channel, setChannel] = useState<Channel>()

  useEffect(() => {
    if (currentAccount) {
      const channel = pusher.subscribe(currentAccount)
      setChannel(channel)
    }
  }, [currentAccount])

  return (
    <PusherContext.Provider value={{ channel }}>
      {children}
    </PusherContext.Provider>
  )
}
