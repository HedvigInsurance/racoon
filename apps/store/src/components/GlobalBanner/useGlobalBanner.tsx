import { atom, useAtom, useSetAtom } from 'jotai'

const GLOBAL_BANNER_ATOM = atom<string | null>(null)

export const useGlobalBanner = () => {
  return useAtom(GLOBAL_BANNER_ATOM)
}

export const useSetGlobalBanner = () => {
  return useSetAtom(GLOBAL_BANNER_ATOM)
}
