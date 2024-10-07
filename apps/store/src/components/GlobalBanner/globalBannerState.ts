import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import type { Banner } from '@/components/Banner/Banner.types'
import { globalStore } from 'globalStore'

type SetBannerOptions = {
  force: boolean // If true, replace existing banner when present and reset dismissed flag
}

// Represents 0 or 1 global banner announcements and tracks visible/dismissed state within the same session
// Banner is identified by string id, so dismissing a banner does not prevent banner with different id from being shown
//
// We intentionally don't support banner stack or any other forms of multiple banners being tracked or displayed
const globalBannerAtom = atom(
  (get) => {
    const currentBanner = get(currentBannerAtom)
    const dismissedBannerId = get(dismissedBannerIdAtom)
    if (currentBanner != null && dismissedBannerId !== currentBanner.id) {
      return currentBanner
    }
    return null
  },
  (get, set, newBanner: Banner | null, options?: SetBannerOptions) => {
    if (newBanner == null) {
      set(currentBannerAtom, null)
      return
    }

    const { id: currentId } = get(currentBannerAtom) ?? {}
    const dismissedId = get(dismissedBannerIdAtom)
    if (currentId == null || dismissedId === currentId || options?.force) {
      set(currentBannerAtom, newBanner)
    }
    if (options?.force && dismissedId === newBanner.id) {
      set(dismissedBannerIdAtom, null)
    }
  },
)

const currentBannerAtom = atom<Banner | null>(null)

const dismissedBannerIdAtom = atomWithStorage<string | null>(
  'dismissedGlobalBannerId',
  null,
  createJSONStorage(() => window.sessionStorage),
)

export function useGlobalBanner() {
  return useAtom(globalBannerAtom, { store: globalStore })
}
export function useGlobalBannerValue() {
  return useAtomValue(globalBannerAtom, { store: globalStore })
}
export function useSetGlobalBanner() {
  return useSetAtom(globalBannerAtom, { store: globalStore })
}

export function useDismissBanner() {
  return useSetAtom(dismissedBannerIdAtom, { store: globalStore })
}
