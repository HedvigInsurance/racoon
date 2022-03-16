import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getAllLinks, getStoryBySlug } from '@/lib/storyblok'

import DynamicComponent from '@/components/DynamicComponent'
import Head from 'next/head'
import type { PageStoryData } from '@/lib/types'
import type { ParsedUrlQuery } from 'querystring'
import React from 'react'
import useStoryblok from '@/lib/useStoryblok'

type Props = {
  preview: boolean
  story: PageStoryData
}

type Params = ParsedUrlQuery & {
  slug: Array<string>
}

const Page: NextPage<Props> = (props) => {
  const story = useStoryblok(props.story, props.preview)

  return (
    <div>
      <Head>
        <title>{story ? story.name : 'My site'}</title>
      </Head>

      {story.content.body.map((block) => (
        <DynamicComponent key={block._uid} block={block} />
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const slug = context.params?.slug ? context.params.slug.join('/') : 'home'

  const story = await getStoryBySlug(slug, { preview: context.preview })

  return {
    props: {
      story,
      preview: context.preview || false,
    },
    revalidate: 3600, // revalidate every hour
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allLinks = await getAllLinks()

  const paths = allLinks
    .filter((item) => item.is_folder === false)
    .filter((item) => item.published === true)
    .filter((item) => item.slug.endsWith('/global/') === false)
    .filter((item) => item.slug !== 'home')
    .map<{ params: Params }>((item) => ({
      params: { slug: item.slug.split('/') },
    }))

  return {
    paths,
    fallback: false,
  }
}

export default Page
