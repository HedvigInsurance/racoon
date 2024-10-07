import { atom, useSetAtom } from 'jotai'
import { globalStore } from 'globalStore'

export const appErrorAtom = atom<Error | null>(null)

export const useShowAppError = () => {
  const showAppError = useSetAtom(appErrorAtom, { store: globalStore })
  return showAppError
}
