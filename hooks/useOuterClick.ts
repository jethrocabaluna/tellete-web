/* eslint-disable */
import { useRef, useEffect } from 'react'

const useOuterClick = (callback = () => {}) => {
  const callbackRef = useRef((e: any) => {})
  const innerRef = useRef<any>()

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    const handleClick: EventListener = (e) => {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) {
        callbackRef.current(e)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return innerRef
}

export default useOuterClick
