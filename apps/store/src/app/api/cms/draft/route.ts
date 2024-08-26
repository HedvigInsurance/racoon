import type { ISbStoryData } from '@storyblok/js'
import type { ISbStoriesParams } from '@storyblok/react'
import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStoryblokApi } from '@/services/storyblok/api'
import { fetchStory } from '@/services/storyblok/storyblok'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')

  // TODO: Don't make it NEXT_PUBLIC_ and rotate the value when we've done migrating to app router
  if (secret !== process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  const { slug, version } = getPreviewParams(url.searchParams)

  let story: ISbStoryData
  try {
    story = await fetchStory(getStoryblokApi(), slug, { version })
  } catch {
    return new Response('Invalid page ID', { status: 404 })
  }

  const targetUrl = new URL(url)
  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  targetUrl.pathname = `/${story.full_slug}`
  // We need to keep original search params for live editing to work, just remove secret
  targetUrl.searchParams.delete('secret')
  console.debug(`Previewing ${targetUrl.pathname}, version=${version}`)
  if (version === 'draft') {
    enableDraftMode()
  } else {
    disableDraftMode()
  }

  redirect(targetUrl.toString())
}

const getPreviewParams = (searchParams: URLSearchParams): PreviewParams => {
  const slug = searchParams.get('slug')
  if (slug == null) {
    throw new Error('Preview slug is required')
  }
  const publishedPageId = searchParams.get('_storyblok_published') as string
  if (publishedPageId) {
    return { slug, version: 'published' }
  }

  const draftPageId = searchParams.get('_storyblok') as string
  if (draftPageId) {
    return { slug, version: 'draft' }
  }

  throw new Error('No page ID provided')
}

type PreviewParams = {
  version: ISbStoriesParams['version']
  slug: string
}

const enableDraftMode = () => {
  draftMode().enable()
  // https://github.com/vercel/next.js/issues/49927
  // Patch draft mode cookie with `SameSite=None, Secure` required for iframe preview
  const cookieStore = cookies()
  const cookie = cookieStore.get('__prerender_bypass')!
  cookieStore.set({
    name: '__prerender_bypass',
    value: cookie.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  })
}

const disableDraftMode = () => {
  draftMode().disable()
}
