import clsx from 'clsx'
import React from 'react'
import Button from './Button'
import Modal from './Modal'

type Props = {
  title: string
  subtitle?: string
  type?: 'normal' | 'warning' | 'danger'
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onConfirm: () => void
}

const ConfirmModal = ({
  title,
  subtitle,
  type = 'normal',
  isOpen,
  setIsOpen,
  onConfirm,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div
        className={clsx(
          'h-1',
          type === 'normal' && 'bg-primary-dark dark:bg-primary',
          type === 'warning' && 'bg-warning',
          type === 'danger' && 'bg-danger',
        )}>
      </div>
      <div className="p-5">
        <h3>{title}</h3>
        {
          !!subtitle && <p>{subtitle}</p>
        }
        <div className="flex flex-row-reverse mt-5">
          <div className="flex gap-5">
            <Button title="No" onClick={() => setIsOpen(false)} />
            <Button title="Yes" onClick={onConfirm} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
