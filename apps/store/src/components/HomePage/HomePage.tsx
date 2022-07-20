import styled from '@emotion/styled'
import { StoryblokComponent, StoryData } from '@storyblok/react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowForwardIcon } from 'ui'
import { PageLink } from '@/lib/PageLink'

const Wrapper = styled.main({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const HomePage = (story: StoryData) => {
  return (
    <>
      <Head>
        <title>{story.name}</title>
      </Head>
      <Wrapper>
        <StoryblokComponent blok={story.content} />
        <Link href={PageLink.store()} passHref>
          <a>
            Go to shop <ArrowForwardIcon />
          </a>
        </Link>
      </Wrapper>
    </>
  )
}
