import { useAtom, useSetAtom } from 'jotai'
import { atomWithReset, atomWithStorage } from 'jotai/utils'

const GLOBAL_BANNER_ATOM = atomWithReset<string | null>(null)

const GLOBAL_BANNER_CLOSED_ATOM = atomWithStorage<boolean>('closedBanner', false)

export const useGlobalBanner = () => {
  return useAtom(GLOBAL_BANNER_ATOM)
}

export const useGlobalBannerClosed = () => {
  return useAtom(GLOBAL_BANNER_CLOSED_ATOM)
}

export const useSetGlobalBanner = () => {
  return useSetAtom(GLOBAL_BANNER_ATOM)
}
