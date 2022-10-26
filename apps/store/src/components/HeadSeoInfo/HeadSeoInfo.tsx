import { StoryData } from '@storyblok/react'
import Head from 'next/head'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

export const HeadSeoInfo = ({ story }: { story: StoryData }) => {
  // AB testing
  const { canonicalUrl } = story.content
  // Translations and other alternates
  const { alternates } = story

  return (
    <>
      <Head>{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}</Head>
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
      <link rel="alternate" href={`/${fullSlug}`} hrefLang={getHrefLang(fullSlug)} />
    </Head>
  )
}

const getHrefLang = (fullSlug: string) => {
  const slugLocale = fullSlug.split('/')[0]
  return isRoutingLocale(slugLocale) ? slugLocale : 'x-default'
}
