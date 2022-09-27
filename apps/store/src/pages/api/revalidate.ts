import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import StoryblokClient from 'storyblok-js-client'
import logger from '@/services/logger/server'

type Payload = {
  action: 'published' | 'unpublished' | 'deleted'
  text: string
  story_id: number
  space_id: number
}

const SLUG_TO_ROUTE_MAP: Record<string, string> = {
  home: '/',
}

const STORYBLOK_API = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { action, story_id } = req.body as Payload

  logger.info(`Revalidate: ${action} story ${story_id}`)

  try {
    const { data } = await STORYBLOK_API.getStory(`${story_id}`)
    const route = SLUG_TO_ROUTE_MAP[data.story.full_slug] ?? data.story.full_slug
    const pathToRevalidate = path.join('/', route)

    logger.info(`Revalidating ${pathToRevalidate}`)
    await res.revalidate(pathToRevalidate)
    return res.json({ revalidated: true })
  } catch (error) {
    logger.error(error)
    return res.status(500).json('Error revalidating')
  }
}

export default handler
