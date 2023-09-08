import { atom, useAtom } from 'jotai'

const SHOW_QUICK_ADD_OFFER_ATOM = atom(true)

export const useShowQuickAdd = () => {
  return useAtom(SHOW_QUICK_ADD_OFFER_ATOM)
}
