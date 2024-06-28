import { formatISO } from 'date-fns'
import { type PageStory } from '@/services/storyblok/storyblok'
import { getLinkFieldURL, getImgSrc } from '@/services/storyblok/Storyblok.helpers'

export function ContentTypeStructuredData({ story }: { story: PageStory }) {
  const { type } = story.content

  if (!type) return null

  // Just being extra careful here and covering the case where we get a uncodversed type
  // for whatever reason.
  switch (type) {
    case 'Article':
    case 'NewsArticle':
    case 'BlogPosting':
      return <ArticleStructuredData story={story} />
    case 'ProfilePage':
      return <ProfilePageStructuredData story={story} />
    default:
      console.log('Stuctured data: Unsupported content type:', type)
      return null
  }
}

function ArticleStructuredData({ story }: { story: PageStory }) {
  const { type, image, headline, datePublished, dateModified, authorType, authorName, authorLink } =
    story.content
  const authorLinkUrl = authorLink ? getLinkFieldURL(authorLink) : undefined

  return (
    <script
      key="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type,
          ...(headline && { headline }),
          ...(image && { image: getImgSrc(image.filename) }),
          ...(datePublished && { datePublished: formatDate(datePublished) }),
          ...(dateModified && { dateModified: formatDate(dateModified) }),
          ...(authorType && {
            author: { '@type': authorType, name: authorName, url: authorLinkUrl },
          }),
        }),
      }}
    />
  )
}

function ProfilePageStructuredData({ story }: { story: PageStory }) {
  const { image, datePublished, dateModified, authorName } = story.content

  const mainEntity =
    authorName || image
      ? {
          '@type': 'Person',
          name: authorName,
          image: image ? getImgSrc(image.filename) : undefined,
        }
      : undefined

  return (
    <script
      key="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          ...(datePublished && { dateCreated: formatDate(datePublished) }),
          ...(dateModified && { dateModified: formatDate(dateModified) }),
          mainEntity,
        }),
      }}
    />
  )
}

function formatDate(date: string) {
  // Storyblok return dates in a yyyy-mm-dd hh:00 GMT+0 format.
  // Google expect them in ISO 8601 format.
  return formatISO(new Date(date))
}
