import { createHmac } from 'crypto'
import { revalidatePath } from 'next/cache'
import { revalidateCacheVersion } from '@/services/storyblok/storyblok.rsc'

// https://www.storyblok.com/docs/guide/in-depth/webhooks#story
// Assumes we only subscribe to story events
type WebhookBody = {
  action: 'published' | 'unpublished' | 'deleted' | 'moved'
  story_id: string
  full_slug?: string
}

export async function POST(request: Request) {
  const signature = request.headers.get('webhook-signature')
  const bodyText = await request.text()
  if (getSignature(bodyText) !== signature) {
    return new Response('Invalid signature', { status: 401 })
  }

  let payload: WebhookBody
  try {
    payload = JSON.parse(bodyText)
  } catch (err) {
    console.log('Failed to parse request body', err)
    return new Response('Invalid request', { status: 400 })
  }
  console.log('Storyblok webhook received, revalidating cacheVersion', payload)
  revalidateCacheVersion()
  if (payload.full_slug) {
    // Only handles edit-in-place revalidation.
    // Moving and deleting stories may keep original one available until next redeploy
    // if it's one of statically built pages
    console.log(`Revalidating path ${payload.full_slug}`)
    revalidatePath(payload.full_slug)
  }
  return new Response(null, { status: 204 })
}

const getSignature = (body: string) =>
  createHmac('sha1', process.env.REVALIDATE_SECRET as string)
    .update(body)
    .digest('hex')
