import type { NextPage } from 'next'
import useChainContext from '@/hooks/useChainContext'
import ConnectWallet from '@/components/ConnectWallet'
import Welcome from '@/components/Welcome'
import ThemeToggle from '@/components/ThemeToggle'
import Register from '@/components/Register'
import Header from '@/components/Header'
import MessagingSection from '@/components/MessagingSection'
import SignOperations from '@/components/SignOperations'

const Home: NextPage = () => {
  const { currentAccount, username, signature, isLoading } = useChainContext()

  if (isLoading) return null

  const isRegistered = !!currentAccount && !!username
  const isWalletNotConnected = !currentAccount
  const isConnectedButUnregistered = !!currentAccount && !username
  const showMainSection = isRegistered && signature

  return (
    <div className="relative h-full">
      <div className="absolute top-0 right-0 m-2">
        <ThemeToggle />
      </div>
      <div className="relative h-full w-11/12 2xl:w-5/6 mx-auto">
        {
          !showMainSection && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
              <div className="w-2/3 mx-auto mb-5 md:mb-8 max-w-4xl">
                <Welcome />
              </div>
              {
                isWalletNotConnected && <ConnectWallet />
              }
              {
                isConnectedButUnregistered && (
                  <div className="w-2/3 md:w-1/3 mx-auto">
                    <Register />
                  </div>
                )
              }
              {
                isRegistered && !signature && <SignOperations />
              }
            </div>
          )
        }
        {
          showMainSection && (
            <>
              <Header />
              <MessagingSection />
            </>
          )
        }
      </div>
    </div>
  )
}

export default Home
