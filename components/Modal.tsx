import React, { ReactNode } from 'react'
import ReactModal from 'react-modal'

type Props = {
  children: ReactNode
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
  },
}

ReactModal.setAppElement('#__next')

const Modal = ({
  children,
  isOpen,
  setIsOpen,
}: Props) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={customStyles}
      overlayClassName="modal-overlay"
    >
      <div className="bg-primary dark:bg-primary-dark text-primary-dark dark:text-primary">
        {children}
      </div>
    </ReactModal>
  )
}

export default Modal
