import clsx from 'clsx'
import React, { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import useChainContext from '../hooks/useChainContext'
import useLocalStorage from '../hooks/useLocalStorage'
import Button from './Button'
import ConfirmModal from './ConfirmModal'
import useOuterClick from '@/hooks/useOuterClick'
import Contact from './Contact'

type Props = {
  onSetContact: (contactUsername: string) => void
}

const Contacts = ({
  onSetContact,
}: Props) => {
  const { username, lastSynced, updateLastSynced } = useChainContext()
  const [contacts, setContacts] = useLocalStorage<string[]>(`${username}-contacts`, [])
  const [filteredContacts, setFilteredContacts] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [newContact, setNewContact] = useState('')
  const [active, setActive] = useState('')
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactToRemove, setContactToRemove] = useState('')
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const contactsToolsRef = useOuterClick(() => {
    setSearchOpen(false)
    setAddContactOpen(false)
  })

  const addContact = (contactUsername: string) => {
    if (!contacts.includes(contactUsername) && contactUsername.length > 0) {
      setContacts([...contacts, contactUsername])
      setNewContact('')
    }
  }

  const removeContact = (contactUsername: string) => {
    if (contacts.includes(contactUsername)) {
      setContacts([...contacts.filter(c => c !== contactUsername)])
      setContactToRemove('')
      setConfirmRemoveOpen(false)

      if (active === contactUsername) {
        setActive('')
        onSetContact('')
      }
    }
  }

  const onClickRemove = (contactUsername: string) => {
    setContactToRemove(contactUsername)
    setConfirmRemoveOpen(true)
  }

  const searchHandler = (value: string) => {
    const newFilteredContacts = contacts.filter(contact => contact.toLowerCase().includes(value))
    setFilteredContacts(newFilteredContacts)
    setSearch(value)
  }

  const clickHandler = (contact: string) => {
    setActive(contact)
    onSetContact(contact)
  }

  const onOpenSearch = (value: boolean) => {
    if (value) {
      setAddContactOpen(false)
    }
    setSearchOpen(value)
  }

  const onOpenAddContact = (value: boolean) => {
    if (value) {
      setSearchOpen(false)
    }
    setAddContactOpen(value)
  }

  const onSync = () => {
    updateLastSynced()
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
    }, 1000)
  }

  const displayedContacts = (search ? filteredContacts : contacts).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  return (
    <>
      <ConfirmModal
        title={`Remove ${contactToRemove} from the contacts?`}
        isOpen={confirmRemoveOpen}
        setIsOpen={setConfirmRemoveOpen}
        onConfirm={() => removeContact(contactToRemove)}
      />
      <div className="h-full relative">
        <div ref={contactsToolsRef} className="p-2 border-b relative">
          <h3 className="text-xl inline">Contacts</h3>
          <span className="text-xs ml-1 text-primary-dark dark:text-primary">{lastSynced.toLocaleString()}</span>
          <ArrowPathIcon
            className={clsx(
              'h-6 w-6 mr-2 cursor-pointer absolute top-1/2 right-16 -m-3',
              'text-primary-dark dark:text-primary',
              syncing && 'animate-spin text-success dark:text-success'
            )}
            onClick={() => onSync()}
          />
          <MagnifyingGlassIcon
            className={clsx(
              'h-6 w-6 mr-2 cursor-pointer absolute top-1/2 right-8 -translate-y-1/2',
              'text-primary-dark dark:text-primary',
            )}
            onClick={() => onOpenSearch(!searchOpen)}
          />
          <PlusIcon
            className={clsx(
              'h-6 w-6 mr-2 cursor-pointer absolute top-1/2 right-0 -translate-y-1/2',
              'text-primary-dark dark:text-primary transition-transform',
              addContactOpen && 'rotate-45'
            )}
            onClick={() => onOpenAddContact(!addContactOpen)}
          />
          <div
            className={clsx(
              'absolute top-full right-0 border border-t-0 border-r-0 z-10 w-1/2',
              'bg-primary dark:bg-primary-dark h-0 transition-all overflow-hidden',
              addContactOpen && 'h-32',
              searchOpen && 'h-20',
            )}
          >
            {
              addContactOpen && (
                <div className="p-4">
                  <input
                    className={clsx(
                      'p-2 transition-all block mb-2 w-full',
                      'bg-primary dark:bg-primary-dark',
                      'border border-primary-dark dark:border-primary',
                      'text-primary-dark dark:text-primary',
                    )}
                    type="text"
                    placeholder="Username"
                    onChange={e => setNewContact(e.target.value)}
                    value={newContact}
                  />
                  <Button
                    className='ml-auto block'
                    size="sm"
                    title="Add"
                    solid
                    onClick={() => addContact(newContact.trim())}
                    disabled={!newContact.trim()}
                  />
                </div>
              )
            }
            {
              searchOpen && (
                <div className="p-4">
                  <input
                    className={clsx(
                      'p-2 transition-all block mb-2 w-full',
                      'bg-primary dark:bg-primary-dark',
                      'border border-primary-dark dark:border-primary',
                      'text-primary-dark dark:text-primary',
                    )}
                    type="text"
                    placeholder="Search"
                    onChange={e => searchHandler(e.target.value)}
                  />
                </div>
              )
            }
          </div>
        </div>
        <div className="max-h-44 sm:max-h-full overflow-auto sm:overflow-hidden">
          {
            displayedContacts.map(contact => (
              <Contact
                key={contact}
                active={active === contact}
                contactUsername={contact}
                onClick={clickHandler}
                onRemove={onClickRemove}
              />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Contacts
