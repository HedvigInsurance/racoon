// Workaround to make app dir work with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { ReactNode } from 'react'
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

  return <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
}

export const dynamicParams = false

export default Layout

const initCacheVersionAndFetchGlobalStory = async (locale: RoutingLocale) => {
  // Not using the result, all we need is to put storyblok cache version into NextJs cache
  fetchStoryblokCacheVersion({ cache: 'force-cache' })
  return getStoryBySlug<GlobalStory>('global', { version: 'published', locale })
}
