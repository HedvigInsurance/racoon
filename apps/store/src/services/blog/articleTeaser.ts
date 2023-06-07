import { getBlogArticleStories, StoryblokVersion } from '@/services/storyblok/storyblok'
import { getStoryblokImageSize } from '@/services/storyblok/Storyblok.helpers'

export type BlogArticleTeaser = {
  id: string
  href: string
  heading: string
  date: string
  categories: Array<{
    id: string
    name: string
  }>
  text: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export const getBlogArticleTeasers = async (
  version?: StoryblokVersion,
): Promise<Array<BlogArticleTeaser>> => {
  const blogArticles = await getBlogArticleStories(version)

  const teasers: Array<BlogArticleTeaser> = []

  for (const item of blogArticles) {
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
      categories: item.content.categories.map((category) => ({
        id: category.uuid,
        name: category.name,
      })),
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
