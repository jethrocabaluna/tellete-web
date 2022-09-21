import { SyntheticEvent } from 'react'

export const withStopPropagation = (e: SyntheticEvent, callback: VoidFunction) => {
  callback()
  e.stopPropagation()
}
