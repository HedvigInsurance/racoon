import { NextApiRequest, NextApiResponse } from 'next'
import StoryblokClient from 'storyblok-js-client'
import { fetchStory, StoryblokFetchParams } from '@/services/storyblok/Storyblok.helpers'

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const storyblokClient = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })
  const { version, pageId } = getPreviewParams(req)
  const story = await fetchStory(storyblokClient, pageId, { version })
  if (!story) {
    throw new Error(`Couldn't find story slug=${pageId}, version=${version}`)
  }

  res.setPreviewData({ version })
  // Set SameSite=None, so cookie can be read in the Storyblok iframe
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

const getPreviewParams = (
  req: NextApiRequest,
): { version: StoryblokFetchParams['version']; pageId: string } => {
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

export default preview
