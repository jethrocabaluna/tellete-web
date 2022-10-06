import { InboxItem } from '@/types/common'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import useChainContext from '../hooks/useChainContext'
import useLocalStorage from '../hooks/useLocalStorage'
import Button from './Button'
import ConfirmModal from './ConfirmModal'
import { trpc } from '../utils/trpc'

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
    currentAccount = '',
    hasKeys,
  } = useChainContext()
  const [inbox, setInbox] = useLocalStorage<InboxItem[]>(`${username}-${contactUsername}-inbox`, [])
  const [decryptedInbox, setDecryptedInbox] = useState<InboxItem[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [overwriteLastMessageModalOpen, setOverwriteLastMessageModalOpen] = useState(false)
  const { data: contactPublicKey } = trpc.useQuery(
    ['user.getPublicKey', { username: contactUsername }],
    { enabled: !!username, retry: (_, err) => err.data?.code !== 'NOT_FOUND' },
  )
  const { refetch: getNewMessage } = trpc.useQuery(
    ['message.getMessage', { userAddress: currentAccount, from: contactUsername }],
    {
      enabled: false,
      retry: (_, err) => err.data?.code !== 'NOT_FOUND',
      onSuccess: async (data) => {
        const isDeleted = await deleteMessageFrom(contactUsername)
        if (isDeleted) {
          setInbox([
            ...inbox,
            {
              sender: contactUsername,
              content: data.content,
              createdAt: data.createdAt,
            },
          ])
          updateLastSynced()
        }
      },
    },
  )
  const { refetch: hasMessageTo } = trpc.useQuery(
    ['message.hasMessageTo', { userAddress: currentAccount, to: contactUsername }],
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
    // for (let i = 1; i <= 100; i++) {
    //   newDecryptedInbox.push({
    //     content: `
    //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel scelerisque nibh. Donec nisi augue, feugiat sed ex et, luctus elementum felis. Morbi eu leo dui. Duis placerat condimentum mi, in condimentum sem gravida ultricies. Phasellus sagittis nunc id nibh tincidunt, id viverra metus efficitur. Maecenas ac congue sem. Nunc finibus euismod purus in pretium. Nullam ut eros enim. Suspendisse eget enim non erat semper tristique vel vitae dolor. Vestibulum suscipit elementum purus et congue. Etiam egestas et erat vitae tristique. Nulla aliquam pulvinar massa, at sodales justo vulputate eu. Sed mollis lacinia neque pharetra posuere. Donec et lectus luctus, volutpat felis et, pretium elit. Donec volutpat ipsum id ex scelerisque tempor. Proin et faucibus tortor.

    //     Mauris at urna in ligula dapibus convallis vitae in quam. Aenean posuere nisi enim, at aliquam tellus gravida id. Vivamus eu risus ornare, placerat purus id, egestas justo. Fusce tempor nisi ipsum, quis molestie velit facilisis at. Donec pulvinar erat nec diam venenatis vestibulum. Aliquam convallis magna ac congue dapibus. Pellentesque eget viverra leo, vel mollis augue. Donec sollicitudin orci eros, nec rutrum libero suscipit nec. Sed aliquam vulputate mi, a cursus magna efficitur cursus.
    //     `,
    //     sender: Math.random() > 0.5 ? username! : contactUsername,
    //     createdAt: new Date().getTime(),
    //   })
    // }
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
    if (!contactPublicKey) return
    const encryptedMessage = await sendMessage(contactUsername, message.trim(), contactPublicKey)
    if (encryptedMessage) {
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
    } else {
      console.error('failed to send message')
    }
  }

  const onConfirmSendMessage = async (message: string) => {
    await sendNewMessage(message, true)
    setOverwriteLastMessageModalOpen(false)
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
            onClick={() => getNewMessage()}
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
            disabled={!newMessage}
          />
        </div>
      </div>
    </>
  )
}

export default ChatBox
