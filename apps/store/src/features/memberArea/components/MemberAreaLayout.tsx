import { clsx } from 'clsx'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { HeaderBlock } from '@/blocks/HeaderBlock/HeaderBlock'
import type {
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
  GlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import type { GlobalStory, PageStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getHrefLang, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import {
  content,
  contentSkeleton,
  layoutWrapper,
  loadingWrapper,
  main,
} from './MemberAreaLayout.css'
import { Menu, MenuLoadingState } from './Menu/Menu'

type Props = {
  children: ReactElement<{
    className: string
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
    story: PageStory | undefined
    globalStory: GlobalStory | undefined
    pathnameWithoutLocale: string
  }>
}

export const MemberAreaLayout = ({ children }: Props) => {
  const { className, globalStory, pathnameWithoutLocale } = children.props
  const { loading } = useMemberAreaMemberInfoQuery()

  // Happens for transitions from pages with layout to pages without layout
  if (!globalStory) return null

  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <AlternateLinks pathnameWithoutLocale={pathnameWithoutLocale} />
      <div className={clsx(layoutWrapper, className)}>
        {headerBlock.map((nestedBlock) => (
          <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
        {loading ? (
          <main className={main}>
            <MenuLoadingState />
            <ContentLoadingState />
          </main>
        ) : (
          <main className={main}>
            <Menu />
            <div className={content}>{children}</div>
          </main>
        )}
      </div>
    </>
  )
}

function AlternateLinks({ pathnameWithoutLocale }: { pathnameWithoutLocale: string }) {
  const locale = useRoutingLocale()
  const { locales: availableLocales } = getCountryByLocale(locale)

  return (
    <Head>
      {availableLocales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={getHrefLang(toRoutingLocale(locale))}
          href={`/${toRoutingLocale(locale)}${pathnameWithoutLocale}`}
        />
      ))}
    </Head>
  )
}

const ContentLoadingState = () => {
  return (
    <div className={loadingWrapper}>
      <Skeleton className={contentSkeleton} />
      <Skeleton className={contentSkeleton} />
    </div>
  )
}
