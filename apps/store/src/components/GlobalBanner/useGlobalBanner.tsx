import { atom, useAtom, useSetAtom } from 'jotai'
import { createJSONStorage, atomWithStorage } from 'jotai/utils'
import { useCallback } from 'react'
import { Banner, BannerVariant } from '@/components/Banner/Banner.types'

type SetBannerOptions = {
  // When 'true' it persisted 'dismissed' info will be ignored.
  force: boolean
}

const BANNER_ATOM = atom<Banner | null>(null)

const PERSISTED_DISMISSED_ATOM = atomWithStorage<boolean>(
  'closedBanner',
  false,
  createJSONStorage(() => sessionStorage),
)

const GLOBAL_BANNER_ATOM = atom(
  (get) => {
    const isBannerDismissed = get(PERSISTED_DISMISSED_ATOM)
    return isBannerDismissed ? null : get(BANNER_ATOM)
  },
  (get, set, newBanner: Banner, options?: SetBannerOptions) => {
    const isBannerDismissed = get(PERSISTED_DISMISSED_ATOM)

    if (isBannerDismissed) {
      if (options?.force) {
        set(PERSISTED_DISMISSED_ATOM, false)
        set(BANNER_ATOM, newBanner)
      }
    } else {
      const currentBanner = get(BANNER_ATOM)
      if (currentBanner === null || options?.force) {
        set(BANNER_ATOM, newBanner)
      }
    }
  },
)

export const useGlobalBanner = () => {
  const [banner, setBanner] = useAtom(GLOBAL_BANNER_ATOM)
  const persistedDismissBanner = useSetAtom(PERSISTED_DISMISSED_ATOM)

  const addBanner = useCallback(
    (content: string, variant?: BannerVariant, options?: SetBannerOptions) => {
      setBanner(
        {
          content,
          variant: variant ?? 'info',
        },
        options,
      )
    },
    [setBanner],
  )

  const dismissBanner = useCallback(() => {
    persistedDismissBanner(true)
  }, [persistedDismissBanner])

  return {
    banner,
    addBanner,
    dismissBanner,
  }
}
