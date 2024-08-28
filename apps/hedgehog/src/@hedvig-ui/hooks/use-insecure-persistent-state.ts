import * as React from 'react'

export const useInsecurePersistentState = <T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(() => {
    const persistedValue = localStorage.getItem(`hvg:${key}`)
    return persistedValue ? JSON.parse(persistedValue) : defaultValue
  })

  React.useEffect(() => {
    localStorage.setItem(`hvg:${key}`, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}
