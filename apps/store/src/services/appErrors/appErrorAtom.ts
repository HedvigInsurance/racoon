import { atom, useSetAtom } from 'jotai'
import { layoutJotaiStore } from '@/app/LayoutJotaiProvider'

export const appErrorAtom = atom<Error | null>(null)

export const useShowAppError = () => {
  const showAppError = useSetAtom(appErrorAtom, { store: layoutJotaiStore })
  return showAppError
}
