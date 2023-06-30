// Next.js Draft Mode
// nextjs.org/docs/pages/building-your-application/configuring/draft-mode#step-1-create-and-access-the-api-route

import { ISbStoryData } from '@storyblok/react'
import { NextApiRequest, NextApiResponse } from 'next'
import StoryblokClient from 'storyblok-js-client'
import { StoryblokFetchParams, fetchStory } from '@/services/storyblok/Storyblok.helpers'
import { ORIGIN_URL } from '@/utils/PageLink'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.secret !== process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { version, pageId } = getPreviewParams(req)
  let story: ISbStoryData
  try {
    const client = new StoryblokClient({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    })
    story = await fetchStory(client, pageId, { version })
  } catch (error) {
    return res.status(401).json({ message: 'Invalid page ID' })
  }

  res.setDraftMode({ enable: true })

  // Set SameSite=None, so cookie can be read in the Storyblok iframe
  const previous = res.getHeader('Set-Cookie')
  if (Array.isArray(previous)) {
    previous.forEach((cookie, index) => {
      previous[index] = cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    })
    res.setHeader('Set-Cookie', previous)
  }

  const url = new URL(req.url ?? '', ORIGIN_URL)
  url.searchParams.delete('secret')

  const targetUrl = `/${story.full_slug}`
  console.debug(`Previewing ${targetUrl}`)
  res.redirect(`${targetUrl}?${url.searchParams.toString()}`)
}

type PreviewParams = {
  version: StoryblokFetchParams['version']
  pageId: string
}

const getPreviewParams = (req: NextApiRequest): PreviewParams => {
  const publishedPageId = req.query._storyblok_published as string
  if (publishedPageId) {
    return { pageId: publishedPageId, version: 'published' }
  }

  const draftPageId = req.query._storyblok as string
  if (draftPageId) {
    return { pageId: draftPageId, version: 'draft' }
  }

  throw new Error('No page ID provided')
}

export default handler
