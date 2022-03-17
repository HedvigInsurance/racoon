import type { NextApiRequest, NextApiResponse } from 'next'
import { getStoryBySlug } from '@/lib/storyblok'

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const slug = req.query.slug as string | undefined || ''
  // Get the storyblok params for the bridge to work
  const params = req.url?.split('?') ?? []

  // Fetch the headless CMS to check if the provided `slug` exists
  const story = await getStoryBySlug(slug, { preview: true })

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!story) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie') ?? []
  if (typeof cookies === 'object') {
    res.setHeader(
      "Set-Cookie",
      cookies.map((cookie) =>
        cookie.replace("SameSite=Lax", "SameSite=None;Secure")
      )
    );
  }

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/${story.full_slug}?${params[1]}` })
  res.end()
}
