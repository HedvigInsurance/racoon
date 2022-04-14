import { LocaleData } from '@/lib/l10n/locales'
import { MarketLabel } from '@/lib/types'

const EMBARK_STORY_BY_MARKET: Record<MarketLabel, string> = {
  [MarketLabel.SE]: '',
  [MarketLabel.DK]: '',
  [MarketLabel.NO]: 'onboarding-NO',
}

const EMBARK_URL_SLUG_BY_MARKET: Record<MarketLabel, string> = {
  [MarketLabel.SE]: '',
  [MarketLabel.DK]: '',
  [MarketLabel.NO]: 'onboarding',
}

type EmbarkStore = Record<string, string | number | boolean>

export const Embark = {
  setStore: (locale: LocaleData, initialStore: EmbarkStore) => {
    const storyName = EMBARK_STORY_BY_MARKET[locale.marketLabel]

    if (!storyName) return

    const embarkStoryKey = `embark-story-${storyName}`
    window.sessionStorage.setItem(embarkStoryKey, JSON.stringify(initialStore))
  },
  getStore: (locale: LocaleData) => {
    const storyName = EMBARK_STORY_BY_MARKET[locale.marketLabel]

    if (!storyName) return

    const embarkStoryKey = `embark-story-${storyName}`
    return window.sessionStorage.getItem(embarkStoryKey)
  },
  getSlug: (locale: LocaleData) => {
    return EMBARK_URL_SLUG_BY_MARKET[locale.marketLabel]
  },
}
