import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { StoryblokPageItem } from "@/lib/types";

import React from "react";
import Head from "next/head";
import DynamicComponent from "@/components/dynamic-component";
import useStoryblok from "@/lib/use-storyblok";
import { getAllLinksWithSlug, getPageBySlug } from "@/lib/storyblok";

interface Props {
  preview: boolean;
  story: StoryblokPageItem
}

interface Params extends ParsedUrlQuery {
   slug: Array<string>
}

const Page: NextPage<Props> = (props) => {
  const story = useStoryblok(props.story, props.preview);

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
  const slug = context.params?.slug ? context.params.slug.join("/") : "home";

  const data = await getPageBySlug(slug, { preview: context.preview });
 
  return {
    props: {
      story: data,
      preview: context.preview || false
    },
    revalidate: 3600, // revalidate every hour
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const allLinks = await getAllLinksWithSlug()

  const paths = allLinks
    .filter((item) => item.isFolder === false)
    .filter((item) => item.published === true)
    .filter((item) => item.slug.endsWith("/global/") === false)
    .filter((item) => item.slug !== 'home')
    .map<{ params: Params }>((item) => ({
      params: { slug: item.slug.split("/") }
    }))

  return {
    paths,
    fallback: false,
  }
}

export default Page
