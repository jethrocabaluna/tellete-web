import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

const useThemeContext = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('No ThemeContext.Provider found')
  }

  return context
}

export default useThemeContext
