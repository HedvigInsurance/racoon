import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStoryblokApi } from '@/services/storyblok/api'

type Payload = {
  action: 'published' | 'unpublished' | 'deleted'
  text: string
  story_id: number
  space_id: number
}

// TODO: Probably not needed, we should use "Define as folder root" in CMS instead
const SLUG_TO_ROUTE_MAP: Record<string, string> = {
  home: '/',
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { story_id, action } = req.body as Payload
  const version = action === 'unpublished' ? 'draft' : 'published'

  try {
    const { data } = await getStoryblokApi().getStory(`${story_id}`, { version })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const route = SLUG_TO_ROUTE_MAP[data.story.full_slug] ?? data.story.full_slug
    const pathToRevalidate = path.join('/', route).replace(/\/$/, '')
    console.log(`Revalidating ${pathToRevalidate}`)
    await res.revalidate(pathToRevalidate)
    return res.json({ revalidated: true })
  } catch (error) {
    console.error('Error revalidating', error)
    return res.status(500).json('Error revalidating')
  }
}

export default handler
