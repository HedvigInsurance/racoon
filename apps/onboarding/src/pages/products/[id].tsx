import { getStoryblokApi, StoryblokStoryData, useStoryblokState } from '@storyblok/react'
import { storyblokInit, apiPlugin } from '@storyblok/react'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Button, Heading } from 'ui'
import { BodyText } from '@/components/BodyText'

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
})

type Props = {
  story: StoryblokStoryData
}

type Params = {
  id: string
}

const ProductPage: NextPage<Props> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)

  return (
    <div>
      <header style={{ backgroundColor: 'black' }}>
        <Heading variant="s" headingLevel="h2" colorVariant="light">
          {story.content.tagline}
        </Heading>
        <img src={story.content.image.filename} />

        <div>
          <BodyText variant={0} colorVariant="light">
            {story.content.ratingScore} ({story.content.ratingCount} reviews)
          </BodyText>
        </div>
      </header>

      <h1>{story.content.title}</h1>
      <p>{story.content.subTitle}</p>

      <main>
        <section>
          <h2>{story.content.title}</h2>
          <Button>Go to price calculator</Button>
          <Link href="/">Read the full terms and conditions</Link>
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ locale, query }) => {
  if (typeof locale !== 'string') return { notFound: true }

  const storyblokApi = getStoryblokApi()
  let { data } = await storyblokApi.get(`cdn/stories/products/${query.id}?language=${locale}`, {
    version: process.env.NODE_ENV === 'development' ? 'draft' : 'published',
  })

  if (!data) return { notFound: true }

  const translations = await serverSideTranslations(locale)

  return { props: { ...translations, story: data.story } }
}

export default ProductPage
