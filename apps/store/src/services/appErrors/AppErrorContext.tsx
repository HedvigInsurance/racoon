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
  lastError: Error | null
  setLastError: Dispatch<SetStateAction<Error | null>>
}

const AppErrorContext = createContext<AppErrorContextValue | null>(null)

type AppErrorHandleContextValue = {
  showError: (error: Error) => void
}

const AppErrorHandleContext = createContext<AppErrorHandleContextValue | null>(null)

export const AppErrorProvider = ({ children }: PropsWithChildren) => {
  const [lastError, setLastError] = useState<Error | null>(null)
  const errorContextValue = useMemo(() => ({ lastError, setLastError }), [lastError])

  const handleErrorContextValue = useMemo<AppErrorHandleContextValue>(
    () => ({
      showError(error: Error) {
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
