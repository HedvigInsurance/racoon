import type { NextApiRequest, NextApiResponse } from 'next'

import { getPageBySlug } from '@/lib/storyblok'

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  if (
    req.query.secret !== process.env.STORYBLOK_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const page = await getPageBySlug(req.query.slug as string, { preview: true })

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/posts/${page.full_slug}` })
  res.end()
}
