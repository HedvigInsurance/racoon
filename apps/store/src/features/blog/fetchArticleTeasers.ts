import { type SbBlokData, type ISbStoryData, type ISbRichtext } from '@storyblok/react'
import { type SEOData, type StoryblokAsset, fetchStories } from '@/services/storyblok/storyblok'
import { getStoryblokImageSize } from '@/services/storyblok/Storyblok.helpers'
import { RoutingLocale } from '@/utils/l10n/types'
import { BLOG_ARTICLE_CONTENT_TYPE } from './blog.constants'
import { convertToBlogArticleCategory } from './blog.helpers'
import { type BlogArticleTeaser } from './blog.types'

type FetchArticlesParams = { locale: RoutingLocale; draft?: boolean }

export const fetchArticleTeasers = async (
  params: FetchArticlesParams,
): Promise<Array<BlogArticleTeaser>> => {
  const stories = await fetchArticles(params)

  const teasers: Array<BlogArticleTeaser> = []

  for (const item of stories) {
    const sizeProps = getStoryblokImageSize(item.content.teaser_image.filename)
    if (sizeProps === null) {
      console.warn(`Could not get image size for ${item.content.teaser_image.filename}`)
      console.warn(`Skipping blog article, ${item.content.page_heading}`)
      continue
    }

    teasers.push({
      id: item.uuid,
      href: item.full_slug,
      heading: item.content.page_heading,
      date: item.content.date,
      categories: item.content.categories.map(convertToBlogArticleCategory),
      text: item.content.teaser_text,
      image: {
        src: item.content.teaser_image.filename,
        alt: item.content.teaser_image.alt,
        ...sizeProps,
      },
    })
  }

  return teasers
}

type BlogArticleContentType = ISbStoryData<
  {
    date: string
    footer: Array<SbBlokData>
    body: Array<SbBlokData>
    content: ISbRichtext
    categories: Array<ISbStoryData>
    teaser_text: string
    page_heading: string
    teaser_image: StoryblokAsset
  } & SEOData
>

const fetchArticles = async (
  params: FetchArticlesParams,
): Promise<Array<BlogArticleContentType>> => {
  const response = await fetchStories({
    content_type: BLOG_ARTICLE_CONTENT_TYPE,
    starts_with: `${params.locale}/`,
    resolve_relations: `${BLOG_ARTICLE_CONTENT_TYPE}.categories`,
    ...(params.draft && { version: 'draft' }),
  })

  return response.data.stories as Array<BlogArticleContentType>
}
