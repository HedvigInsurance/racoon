import { ISbAlternateObject, ISbStoryData } from '@storyblok/react'
import Head from 'next/head'
import { SEOData } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL } from '@/utils/PageLink'
import { StructuredDataOrganization } from './StructuredDataOrganization'

export const HeadSeoInfo = ({ story }: { story: ISbStoryData<SEOData> }) => {
  // AB testing
  const { canonicalUrl, robots, seoTitle, seoMetaDescription, seoMetaOgImage } = story.content

  return (
    <>
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="robots" content={robots} />
        {seoMetaDescription && (
          <>
            <meta name="description" content={seoMetaDescription} />
            <meta property="og:description" content={seoMetaDescription} />
          </>
        )}
        {seoMetaOgImage?.filename && <meta property="og:image" content={seoMetaOgImage.filename} />}
        {seoTitle && (
          <>
            <meta property="og:title" content={seoTitle} />
            <title>{seoTitle}</title>
          </>
        )}
        <StructuredDataOrganization />
      </Head>
      {/* Must include link to self along with other variants */}

      <AlternateLinks story={story} />
    </>
  )
}

const AlternateLinks = ({ story }: { story: ISbStoryData<SEOData> }) => {
  const alternates = story.alternates.filter(isVisibleAlternate)

  return (
    <>
      <AlternateLink fullSlug={story.full_slug} />
      {alternates.map((alternate) => (
        <AlternateLink key={alternate.id} fullSlug={alternate.full_slug} />
      ))}
    </>
  )
}

const isVisibleAlternate = (alternate: ISbAlternateObject) =>
  Features.enabled('ENGLISH_LANGUAGE') || !getHrefLang(alternate.full_slug).startsWith('en-')

const AlternateLink = ({ fullSlug }: { fullSlug: string }) => {
  return (
    <Head>
      <link
        rel="alternate"
        href={`${ORIGIN_URL}/${removeTrailingSlash(fullSlug)}`}
        hrefLang={getHrefLang(fullSlug)}
      />
    </Head>
  )
}

const getHrefLang = (fullSlug: string) => {
  const slugLocale = fullSlug.split('/')[0]
  return isRoutingLocale(slugLocale) ? toIsoLocale(slugLocale) : 'x-default'
}

const removeTrailingSlash = (url: string) => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
