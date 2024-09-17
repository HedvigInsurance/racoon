import 'server-only'
import type { ISbStoryData } from '@storyblok/js'
import type { SbBlokData } from '@storyblok/react'
import type { ReactNode } from 'react'
import { StoryblokProvider } from '@/appComponents/providers/StoryblokProvider'
import {
  BLOG_ARTICLE_CATEGORIES_PAGE_PROP,
  BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
  BLOG_ARTICLE_CATEGORY_LIST_BLOCK,
  BLOG_ARTICLE_CONTENT_TYPE,
  BLOG_ARTICLE_LIST_BLOCK,
  BLOG_ARTICLE_TEASERS_PAGE_PROP,
} from '@/features/blog/blog.constants'
import { convertToBlogArticleCategory } from '@/features/blog/blog.helpers'
import type { BlogArticleContentType, BlogArticleTeaser } from '@/features/blog/blog.types'
import type { BlogPageProps } from '@/features/blog/BlogContextProvider'
import { BlogContextProvider } from '@/features/blog/BlogContextProvider'
import { BlogStoryblokProvider } from '@/features/blog/BlogStoryblokProvider'
import { getImgSrc, getStoryblokImageSize } from '@/services/storyblok/Storyblok.helpers'
import { getBlogArticles, getBlogCategories } from '@/services/storyblok/storyblok.rsc'
import type { RoutingLocale } from '@/utils/l10n/types'

type Props = {
  locale: RoutingLocale
  story: ISbStoryData
  children: ReactNode
}

export async function BlogStoryContainer({ locale, story, children }: Props) {
  const blogPageProps: BlogPageProps = {}
  const requests: Array<Promise<void>> = []
  if (findBlock(story, BLOG_ARTICLE_CATEGORY_LIST_BLOCK) != null) {
    requests.push(
      getBlogCategories(locale).then((categories) => {
        blogPageProps[BLOG_ARTICLE_CATEGORIES_PAGE_PROP] = categories
      }),
    )
  }
  if (findBlock(story, BLOG_ARTICLE_LIST_BLOCK) != null) {
    requests.push(
      getBlogArticles(locale).then((articles) => {
        blogPageProps[BLOG_ARTICLE_TEASERS_PAGE_PROP] = articleStoriesToTeasers(articles)
      }),
    )
  }
  await Promise.all(requests)

  const isBlogArticlePage = story.content.component === BLOG_ARTICLE_CONTENT_TYPE
  const isBlogCategoryPage = story.content.component === BLOG_ARTICLE_CATEGORY_CONTENT_TYPE
  const shouldLoadBlogBlocks = isBlogArticlePage || isBlogCategoryPage

  return (
    <BlogContextProvider blogPageProps={blogPageProps}>
      {shouldLoadBlogBlocks ? (
        <BlogStoryblokProvider>{children}</BlogStoryblokProvider>
      ) : (
        <StoryblokProvider>{children}</StoryblokProvider>
      )}
    </BlogContextProvider>
  )
}

const findBlock = (story: ISbStoryData, component: string) => {
  const body = story.content.body as Array<SbBlokData> | undefined
  return body?.find((item) => item.component === component)
}

const articleStoriesToTeasers = (
  stories: Array<BlogArticleContentType>,
): Array<BlogArticleTeaser> => {
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
      categories: item.content.categories.map((item) =>
        convertToBlogArticleCategory(item as ISbStoryData),
      ),
      text: item.content.teaser_text,
      image: {
        src: getImgSrc(item.content.teaser_image.filename),
        alt: item.content.teaser_image.alt,
        ...sizeProps,
      },
    })
  }
  return teasers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
