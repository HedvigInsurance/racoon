import type { ISbStoryData } from '@storyblok/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { SEOData } from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'
import { isBrowser } from '@/utils/env'
import { organization } from '@/utils/jsonSchema'
import { getLocaleOrFallback, isRoutingLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL, removeSEHomepageLangSegment } from '@/utils/PageLink'

type Props = {
  story: ISbStoryData<SEOData>
  robots?: 'index' | 'noindex'
}

export const HeadSeoInfo = ({ story, robots }: Props) => {
  const { canonicalUrl, seoTitle, seoMetaDescription, seoMetaOgImage } = story.content
  // Make it possible to override robots value for A/B test cases
  const robotsContent = robots ?? story.content.robots

  const { asPath } = useRouter()
  // remove trailing slash
  const pathname = asPath.replace(/\/$/, '')
  const pageURL = new URL(pathname, ORIGIN_URL)

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl || pageURL.toString()} />
        <meta property="og:url" content={pageURL.toString()} />
        <meta name="robots" content={robotsContent} />
        {seoMetaDescription && (
          <>
            <meta name="description" content={seoMetaDescription} />
            <meta property="og:description" content={seoMetaDescription} />
          </>
        )}
        {seoMetaOgImage?.filename && (
          <meta property="og:image" content={getImgSrc(seoMetaOgImage.filename)} />
        )}
        {seoTitle && (
          <>
            <meta property="og:title" content={seoTitle} />
            <title>{seoTitle}</title>
          </>
        )}
        {/* isBrowser check is needed due to bug in Next where script tag is inserted twice despite having a key */}
        {isBrowser() && (
          <script
            key="organization-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
          />
        )}
      </Head>
      {/* Must include link to self along with other variants */}

      <AlternateLinks story={story} />
    </>
  )
}

const AlternateLinks = ({ story }: { story: ISbStoryData<SEOData> }) => {
  return (
    <>
      <AlternateLink fullSlug={story.full_slug} />
      {story.alternates.map((alternate) => (
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
        href={removeSEHomepageLangSegment(`${ORIGIN_URL}/${fullSlug}`)}
        hrefLang={getHrefLang(fullSlug)}
      />
    </Head>
  )
}

const getHrefLang = (fullSlug: string) => {
  const slugLocale = fullSlug.split('/')[0]
  if (isRoutingLocale(slugLocale)) {
    return getLocaleOrFallback(slugLocale).locale
  }

  return 'x-default'
}
