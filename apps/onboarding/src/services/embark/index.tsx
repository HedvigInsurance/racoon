import { useRouter } from 'next/router'
import { LocaleData } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/page-link'
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

export const useEmbark = (locale: LocaleData) => {
  const router = useRouter()
  const storyName = EMBARK_STORY_BY_MARKET[locale.marketLabel]
  const slug = EMBARK_URL_SLUG_BY_MARKET[locale.marketLabel]

  const startEmbark = (config?: { initialStore: EmbarkStore }) => {
    if (!storyName || !slug) return

    if (config?.initialStore) {
      window.sessionStorage.setItem(
        `embark-story-${storyName}`,
        JSON.stringify(config.initialStore),
      )
    }

    router.push(PageLink.embark({ locale: locale.path, slug }))
  }

  return { startEmbark }
}
