import { Market } from '@/lib/types'

const EMBARK_STORY_BY_MARKET: Record<Market, string> = {
  [Market.Sweden]: process.env.NEXT_PUBLIC_EMBARK_STORY_SE ?? '',
  [Market.Denmark]: process.env.NEXT_PUBLIC_EMBARK_STORY_DK ?? 'onboarding-DK-v2',
  [Market.Norway]: process.env.NEXT_PUBLIC_EMBARK_STORY_NO ?? 'onboarding-NO-v3',
}

const EMBARK_URL_SLUG_BY_MARKET: Record<Market, string> = {
  [Market.Sweden]: '',
  [Market.Denmark]: 'onboarding',
  [Market.Norway]: 'onboarding',
}

type EmbarkStore = Record<string, string | number | boolean>

export const Embark = {
  Story: {
    SwedenNeeder: 'Web Onboarding SE - Quote Cart Needer',
    SwedenSwitcher: 'Web Onboarding SE - Quote Cart Switcher',
  },

  setStoryStore: (storyName: string, initialStore: EmbarkStore) => {
    const serialisedStore = Object.keys(initialStore).reduce((acc, key) => {
      let value = initialStore[key]

      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false'
      }

      return { ...acc, [key]: value }
    }, {})

    const embarkStoryKey = `embark-store-${window.encodeURIComponent(storyName)}`
    window.sessionStorage.setItem(embarkStoryKey, JSON.stringify(serialisedStore))
  },
  setStore: (market: Market, initialStore: EmbarkStore) => {
    const storyName = EMBARK_STORY_BY_MARKET[market]

    if (!storyName) return

    Embark.setStoryStore(storyName, initialStore)
  },
  getSlug: (market: Market) => {
    return EMBARK_URL_SLUG_BY_MARKET[market]
  },
}
