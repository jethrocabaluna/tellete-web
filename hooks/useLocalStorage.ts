import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useLocalStorage = <T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const storedValue = localStorage.getItem(key)
  const [value, setValue] = useState<T>(storedValue ? JSON.parse(storedValue) : initialValue)

  useEffect(() => {
    const newStoredValue = localStorage.getItem(key)
    setValue(newStoredValue ? JSON.parse(newStoredValue) : initialValue)
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue]
}

export default useLocalStorage
