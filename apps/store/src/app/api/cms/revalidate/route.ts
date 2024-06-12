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
  // Delay between revalidations helps with avoiding Vercel cache instability
  // https://github.com/vercel/next.js/issues/55960
  // https://github.com/vercel/next.js/issues/60834
  const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))

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
    await delay()
    // Only handles edit-in-place revalidation.
    // Moving and deleting stories may keep original one available until next redeploy
    // if it's one of statically built pages
    const updatedPath = `/${payload.full_slug}`
    console.log(`Revalidating path ${updatedPath}`)
    revalidatePath(updatedPath, 'page')
  }
  // Finally, wait to let revalidation finish behind the scenes
  await delay()
  return new Response(null, { status: 204 })
}

const getSignature = (body: string) =>
  createHmac('sha1', process.env.REVALIDATE_SECRET as string)
    .update(body)
    .digest('hex')
