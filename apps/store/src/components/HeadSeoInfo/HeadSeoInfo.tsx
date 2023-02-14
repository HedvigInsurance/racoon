import { ISbStoryData } from '@storyblok/react'
import Head from 'next/head'
import { SEOData } from '@/services/storyblok/storyblok'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL } from '@/utils/PageLink'

export const HeadSeoInfo = ({ story }: { story: ISbStoryData<SEOData> }) => {
  // AB testing
  const { canonicalUrl, robots, seoMetaTitle, seoMetaDescription, seoMetaOgImage } = story.content
  // Translations and other alternates
  const { alternates } = story

  return (
    <>
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="robots" content={robots} />
        {seoMetaTitle && (
          <>
            <meta name="title" content={seoMetaTitle} />
            <meta property="og:title" content={seoMetaTitle} />
          </>
        )}
        {seoMetaDescription && (
          <>
            <meta name="description" content={seoMetaDescription} />
            <meta property="og:description" content={seoMetaDescription} />
          </>
        )}
        {seoMetaOgImage?.filename && <meta property="og:image" content={seoMetaOgImage.filename} />}
      </Head>
      {/* Must include link to self along with other variants */}

      <AlternateLink fullSlug={story.full_slug} />
      {alternates.map((alternate) => (
        <AlternateLink key={alternate.id} fullSlug={alternate.full_slug} />
      ))}
    </>
  )
}

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
