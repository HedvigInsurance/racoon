import { NextApiRequest, NextApiResponse } from 'next'
import StoryblokClient from 'storyblok-js-client'
import { fetchStory } from '@/services/storyblok/Storyblok.helpers'

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const pageId = req.query._storyblok as string
  const storyblokClient = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })
  const story = await fetchStory(storyblokClient, pageId, { version: 'draft' })
  if (!story) {
    throw new Error(`Couldn't find preview story slug=${pageId}`)
  }
  res.setPreviewData({})
  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie') ?? []
  if (typeof cookies === 'object') {
    res.setHeader(
      'Set-Cookie',
      cookies.map((cookie) => cookie.replace('SameSite=Lax', 'SameSite=None;Secure')),
    )
  }
  const targetUrl = `/${story.full_slug}`
  console.debug(`Previewing ${targetUrl}`)
  res.redirect(targetUrl)
}

export default preview
