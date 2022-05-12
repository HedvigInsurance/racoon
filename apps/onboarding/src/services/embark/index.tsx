import { LocaleData } from '@/lib/l10n/locales'
import { MarketLabel } from '@/lib/types'

const EMBARK_STORY_BY_MARKET: Record<MarketLabel, Array<string>> = {
  [MarketLabel.SE]: [],
  [MarketLabel.DK]: [],
  [MarketLabel.NO]: ['onboarding-NO', 'onboarding-NOv2'],
}

const EMBARK_URL_SLUG_BY_MARKET: Record<MarketLabel, string> = {
  [MarketLabel.SE]: '',
  [MarketLabel.DK]: '',
  [MarketLabel.NO]: 'onboarding',
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
  setStore: (locale: LocaleData, initialStore: EmbarkStore) => {
    const storyNames = EMBARK_STORY_BY_MARKET[locale.marketLabel]

    storyNames.forEach((storyName) => Embark.setStoryStore(storyName, initialStore))
  },
  getSlug: (locale: LocaleData) => {
    return EMBARK_URL_SLUG_BY_MARKET[locale.marketLabel]
  },
}
