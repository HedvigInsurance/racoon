import { getStoryblokApi, StoryblokComponent, StoryData, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'

type Props = {
  story: StoryData
}

type Params = {
  slug: string[]
}

type Path = {
  params: {
    slug: string[]
  }
}

const Page: NextPageWithLayout<Props> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)
  return (
    <>
      <Head>
        <title>{story.name}</title>
      </Head>
      <div>
        <StoryblokComponent blok={story.content} />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params, preview }) => {
  const slug = params?.slug ? params.slug.join('/') : 'home'

  const sbParams = {
    version: preview ? 'draft' : 'published',
  }

  const storyblokApi = getStoryblokApi()
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams)

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
      preview: preview || false,
    },
    revalidate: 3600,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const storyblokApi = getStoryblokApi()
  let { data } = await storyblokApi.get('cdn/links/')

  let paths: Path[] = []
  Object.keys(data.links).forEach((linkKey) => {
    if (data.links[linkKey].is_folder) {
      return
    }

    const slug = data.links[linkKey].slug
    const splittedSlug = slug.split('/')

    paths.push({ params: { slug: splittedSlug } })
  })

  return {
    paths: paths,
    fallback: false,
  }
}

Page.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default Page
