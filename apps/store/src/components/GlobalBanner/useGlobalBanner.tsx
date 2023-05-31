import { useAtom } from 'jotai'
import { atomWithReset, atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'
import { useCallback } from 'react'
import { Banner, BannerVariant } from '@/components/Banner/Banner.types'

const GLOBAL_BANNER_ATOM = atomWithReset<Banner | null>(null)

const GLOBAL_BANNER_CLOSED_ATOM = atomWithStorage<boolean>(
  'closedBanner',
  false,
  createJSONStorage(() => sessionStorage),
)

export const useGlobalBanner = () => {
  const [banner, setBanner] = useAtom(GLOBAL_BANNER_ATOM)

  const _setBanner = useCallback(
    (content: string | typeof RESET, variant?: BannerVariant) => {
      if (content === RESET) {
        setBanner(RESET)
      } else {
        setBanner({
          content,
          variant: variant ?? 'info',
        })
      }
    },
    [setBanner],
  )

  return [banner, _setBanner] as const
}

export const useSetGlobalBanner = () => {
  const [, setBanner] = useGlobalBanner()

  return setBanner
}

export const useGlobalBannerClosed = () => {
  return useAtom(GLOBAL_BANNER_CLOSED_ATOM)
}
