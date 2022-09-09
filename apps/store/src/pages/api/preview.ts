import { NextApiRequest, NextApiResponse } from 'next'
import StoryblokClient from 'storyblok-js-client'
import { countries } from '@/lib/l10n/countries'
import { CountryLabel } from '@/lib/l10n/types'

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const pageId = req.query._storyblok
  const storyblokClient = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })
  const {
    data: { story },
  } = await storyblokClient.get(`cdn/stories/${pageId}`, { version: 'draft' })

  const [countryLabel, ...slugFragments] = story.full_slug.split('/')

  // Convert storyblok language to locale
  const storyblokLang = req.query._storyblok_lang as string
  const country = countries[countryLabel as CountryLabel]
  const locale =
    country.locales.find((locale) => locale.startsWith(storyblokLang)) ?? country.defaultLocale

  res.setPreviewData({})
  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie') ?? []
  if (typeof cookies === 'object') {
    res.setHeader(
      'Set-Cookie',
      cookies.map((cookie) => cookie.replace('SameSite=Lax', 'SameSite=None;Secure')),
    )
  }
  const targetSlug = `/${locale}/${slugFragments.join('/')}`
  console.debug(`Previewing ${targetSlug}`)
  res.redirect(targetSlug)
}

export default preview
