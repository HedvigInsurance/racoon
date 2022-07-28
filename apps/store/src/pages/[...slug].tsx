import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import {
  getAllLinks,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'

type Path = {
  params: {
    slug: string[]
  }
}

const Page: NextPageWithLayout<StoryblokPageProps> = ({ story: initialStory }) => {
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

export const getStaticProps: GetStaticProps<StoryblokPageProps, StoryblokQueryParams> = async ({
  params,
  preview,
}) => {
  const slug = params?.slug ? params.slug.join('/') : 'home'
  const story = await getStoryBySlug(slug, preview)

  return {
    props: {
      story: story ?? false,
      key: story ? story.id : false,
      preview: preview || false,
    },
    revalidate: 3600,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await getAllLinks()

  const paths: Path[] = []
  Object.keys(links)
    .filter((linkKey) => !links[linkKey].is_folder)
    .filter((linkKey) => !links[linkKey].slug.startsWith('products/'))
    .forEach((linkKey) => {
      const slug = links[linkKey].slug
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
