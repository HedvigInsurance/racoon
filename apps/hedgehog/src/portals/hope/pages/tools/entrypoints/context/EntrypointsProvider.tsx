import { ReactNode } from 'react'
import { useEntrypointsData } from '../hooks'
import { EntrypointsContext } from './EntrypointsContext'

export const EntrypointsProvider = ({ children }: { children?: ReactNode }) => {
  const entrypointsData = useEntrypointsData()
  return (
    <EntrypointsContext.Provider value={entrypointsData}>
      {children}
    </EntrypointsContext.Provider>
  )
}
