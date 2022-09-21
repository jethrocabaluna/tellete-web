import React, { useState } from 'react'
import ChatBox from './ChatBox'
import Contacts from './Contacts'

const MessagingSection = () => {
  const [openedContact, setOpenedContact] = useState('')
  const isContactOpened = !!openedContact

  return (
    <div className="sm:h-5/6 sm:grid sm:grid-cols-3 sm:gap-2">
      <div className="col-span-1 my-3 sm:my-0 sm:h-full sm:overflow-auto border border-primary-dark dark:border-primary">
        <Contacts onSetContact={setOpenedContact} />
      </div>
      <div className="col-span-2 my-3 sm:my-0 sm:h-full sm:overflow-auto border border-primary-dark dark:border-primary">
        {
          isContactOpened && <ChatBox contactUsername={openedContact} />
        }
      </div>
    </div>
  )
}

export default MessagingSection
