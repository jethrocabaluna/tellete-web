import { InboxItem } from '@/types/common'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import useChainContext from '@/hooks/useChainContext'
import useLocalStorage from '@/hooks/useLocalStorage'
import Button from './Button'
import ConfirmModal from './ConfirmModal'
import { trpc } from '../utils/trpc'
import { createContract } from '@/contexts/ChainContext'

type Props = {
  contactUsername: string
}

const ChatBox = ({
  contactUsername,
}: Props) => {
  const {
    decryptMessage,
    deleteMessageFrom,
    encryptMessage,
    sendMessage,
    updateLastSynced,
    username,
    hasKeys,
    currentAccount,
  } = useChainContext()
  const [inbox, setInbox] = useLocalStorage<InboxItem[]>(`${username}-${contactUsername}-inbox`, [])
  const [decryptedInbox, setDecryptedInbox] = useState<InboxItem[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isGettingMessage, setIsGettingMessage] = useState(false)
  const [overwriteLastMessageModalOpen, setOverwriteLastMessageModalOpen] = useState(false)
  const { data: contactPublicKey } = trpc.useQuery(
    ['user.getPublicKey', { username: contactUsername }],
    {
      enabled: !!username,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
  const { refetch: getNewMessage } = trpc.useQuery(
    ['message.getMessage', { from: contactUsername }],
    {
      enabled: false,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
      onSuccess: async (data) => {
        const contract = createContract()
        if (!contract) return
        const filter = contract.filters.MessageDeleted(contactUsername, currentAccount)
        contract.once(filter, () => {
          console.log('triggered MessageDeleted in FE')
          setInbox([
            ...inbox,
            {
              sender: contactUsername,
              content: data.content,
              createdAt: data.createdAt,
            },
          ])
          updateLastSynced()
          setIsGettingMessage(false)
        })
        await deleteMessageFrom(contactUsername)
      },
      onError: () => {
        setIsGettingMessage(false)
      },
    },
  )
  const { refetch: hasMessageTo } = trpc.useQuery(
    ['message.hasMessageTo', { to: contactUsername }],
    {
      enabled: false,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
    },
  )

  useEffect(() => {
    setInbox(JSON.parse(localStorage.getItem(`${username}-${contactUsername}-inbox`) ?? '[]'))
    setNewMessage('')
  }, [username, contactUsername])

  useEffect(() => {
    if (hasKeys) {
      decryptInbox()
    } else {
      setDecryptedInbox([])
    }
  }, [inbox, hasKeys])

  const decryptInbox = async () => {
    const newDecryptedInbox: InboxItem[] = []
    for (const item of inbox) {
      newDecryptedInbox.push({
        ...item,
        content: await decryptMessage(item.content),
      })
    }
    setDecryptedInbox(newDecryptedInbox)
  }

  const sendMessageHandler = async (message: string) => {
    if ((await hasMessageTo()).data) {
      setOverwriteLastMessageModalOpen(true)
    } else {
      sendNewMessage(message)
    }
  }

  const sendNewMessage = async (message: string, replaceLast?: boolean) => {
    const contract = createContract()
    if (!contactPublicKey || !contract) return
    setIsSending(true)
    const encryptedMessage = await sendMessage(contactUsername, message.trim(), contactPublicKey)
    if (encryptedMessage) {
      const filter = contract.filters.MessageSent(currentAccount, contactUsername)
      contract.once(filter, async () => {
        console.log('triggered MessageSent in FE')
        const newInbox = replaceLast ? inbox.filter(item => !item.lastMessage) : inbox.map(item => {
          delete item.lastMessage
          return item
        })
        setInbox([
          ...newInbox,
          {
            sender: username ?? '',
            content: await encryptMessage(message),
            createdAt: Date.now(),
            lastMessage: true,
          },
        ])
        setNewMessage('')
        setIsSending(false)
      })
    } else {
      console.error('failed to send message')
    }
  }

  const onConfirmSendMessage = async (message: string) => {
    await sendNewMessage(message, true)
    setOverwriteLastMessageModalOpen(false)
  }

  const onGetNewMessage = async () => {
    setIsGettingMessage(true)
    await getNewMessage()
  }

  return (
    <>
      <ConfirmModal
        title={`${contactUsername} have not received your message yet. Overwrite your message?`}
        isOpen={overwriteLastMessageModalOpen}
        setIsOpen={setOverwriteLastMessageModalOpen}
        onConfirm={() => onConfirmSendMessage(newMessage)}
        type="warning"
      />
      <div className="chat-box h-128 sm:h-full">
        <div className="chat-box__chats overflow-auto">
          {
            decryptedInbox.map(item => {
              const dateSent = new Date(item.createdAt).toLocaleString()

              return (
                <div className="chat-box__chats__message p-2 m-1 border" key={item.createdAt}>
                  <p className="inline-block whitespace-pre-wrap">
                    <strong>
                      {item.sender}@
                      <span className="text-xs text-primary dark:text-primary-dark bg-primary-dark dark:bg-primary p-0.5">
                        {dateSent}
                      </span>:{' '}
                    </strong>
                    {item.content}
                  </p>
                </div>
              )
            })
          }
        </div>
        <div className="chat-box__tools grid grid-cols-12">
          <Button
            className="col-span-3 xl:col-span-2 text-xs md:text-sm lg:text-base"
            title="Get message"
            onClick={onGetNewMessage}
            disabled={isGettingMessage}
            loading={isGettingMessage}
            loadingTitle="Processing..."
          />
          <textarea
            placeholder="Enter a message"
            className={clsx(
              'p-2 resize-none text-sm lg:text-base outline-none',
              'col-start-4 col-span-6',
              'xl:col-start-3 xl:col-span-8',
            )}
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          ></textarea>
          <Button
            className="col-span-3 xl:col-span-2 text-xs md:text-sm lg:text-base"
            title="Send"
            onClick={() => sendMessageHandler(newMessage)}
            disabled={!newMessage || isSending}
            loading={isSending}
            loadingTitle="Sending..."
          />
        </div>
      </div>
    </>
  )
}

export default ChatBox
