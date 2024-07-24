import { atom, useSetAtom } from 'jotai'

export const appErrorAtom = atom<Error | null>(null)

export const useShowAppError = () => {
  const showAppError = useSetAtom(appErrorAtom)
  return showAppError
}
