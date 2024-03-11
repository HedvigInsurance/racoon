import StoryblokProvider from 'app/providers/StoryblokProvider'
import { ReactNode } from 'react'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { GlobalStory } from '@/services/storyblok/storyblok'
import {
  fetchStoryblokCacheVersion,
  getStoryBySlug,
} from '@/services/storyblok/storyblok.serverOnly'
import { RoutingLocale } from '@/utils/l10n/types'
import { StoryblokLayout } from './StoryblokLayout'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
  const globalStory = await initCacheVersionAndFetchGlobalStory(locale)

  return (
    <RootLayout locale={locale}>
      <StoryblokProvider>
        <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
      </StoryblokProvider>
    </RootLayout>
  )
}

export const dynamicParams = false

export default Layout

const initCacheVersionAndFetchGlobalStory = async (locale: RoutingLocale) => {
  // Not using the result, all we need is to put storyblok cache version into NextJs cache
  fetchStoryblokCacheVersion({ cache: 'force-cache' })
  return getStoryBySlug<GlobalStory>('global', { version: 'published', locale })
}
