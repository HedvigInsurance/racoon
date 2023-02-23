import { ApolloError } from '@apollo/client'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

type AppErrorContextValue = {
  lastError: ApolloError | null
  setLastError: Dispatch<SetStateAction<ApolloError | null>>
}

const AppErrorContext = createContext<AppErrorContextValue | null>(null)

type AppErrorHandleContextValue = {
  showApolloError: (error: ApolloError) => void
}

const AppErrorHandleContext = createContext<AppErrorHandleContextValue | null>(null)

export const AppErrorProvider = ({ children }: PropsWithChildren) => {
  const [lastError, setLastError] = useState<ApolloError | null>(null)
  const errorContextValue = useMemo(() => ({ lastError, setLastError }), [lastError])

  const handleErrorContextValue = useMemo(
    () => ({
      showApolloError(error: ApolloError) {
        setLastError(error)
      },
    }),
    [],
  )

  return (
    <AppErrorContext.Provider value={errorContextValue}>
      <AppErrorHandleContext.Provider value={handleErrorContextValue}>
        {children}
      </AppErrorHandleContext.Provider>
    </AppErrorContext.Provider>
  )
}

export const useAppErrorContext = () => {
  const value = useContext(AppErrorContext)
  if (!value) {
    throw new Error('Cannot use useAppErrorContext outside of provider')
  }
  return value
}

export const useAppErrorHandleContext = () => {
  const value = useContext(AppErrorHandleContext)
  if (!value) {
    throw new Error('Cannot use useAppErrorHandleContext outside of provider')
  }
  return value
}
