import { useState, createContext, ReactNode, FC, useEffect } from 'react'

type Theme = 'dark' | 'light'

type Context = {
  theme: Theme
  changeTheme: (theme: Theme) => void
}

type Props = {
  children: ReactNode
}

export const ThemeContext = createContext<Context | undefined>(undefined)

export const ThemeProvider: FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    if (localStorage) {
      const storedTheme = localStorage.getItem('theme') as Theme
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const changeTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
