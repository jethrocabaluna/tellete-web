import React, { MouseEventHandler, SVGProps } from 'react'
import clsx, { ClassValue } from 'clsx'
import { Size } from '@/types/common'

type Props = {
  title: string
  disabled?: boolean
  size?: Size
  solid?: boolean
  onClick?: MouseEventHandler
  className?: ClassValue[] | string
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
}
const Button = ({
  className,
  title,
  disabled,
  size,
  solid,
  onClick,
  icon: Icon,
}: Props) => {
  return (
    <button
      className={
        clsx(
          'py-2 px-4 border transition-all',
          'text-primary-dark dark:text-primary',
          {
            'border-primary dark:border-primary-dark': solid,
            'text-primary dark:text-primary-dark': solid,
            'bg-primary-dark dark:bg-primary': solid,
            'border-primary-dark dark:border-primary': !solid,
            'text-primary-dark dark:text-primary': !solid,
            'text-xs py-1 px-2': size === 'xs',
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
            'text-xl': size === 'xl',
            'opacity-20': disabled,
          },
          className,
        )
      }
      onClick={onClick}
      disabled={disabled}
    >
      {title}
      {!!Icon && <Icon className="h-4 w-4 inline ml-1" />}
    </button>
  )
}

export default Button
