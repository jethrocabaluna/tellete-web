import React from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import useThemeContext from '@/hooks/useThemeContext'

const ThemeToggle = () => {
  const { theme, changeTheme } = useThemeContext()

  if (theme === 'dark') {
    return (
      <SunIcon
        className="h-5 w-5 cursor-pointer dark:text-primary"
        onClick={() => changeTheme('light')}
      />
    )
  }

  return (
    <MoonIcon
      className="h-5 w-5 cursor-pointer text-primary-dark"
      onClick={() => changeTheme('dark')}
    />
  )
}

export default ThemeToggle
