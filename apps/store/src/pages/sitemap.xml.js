import { getStoryblokApi } from '@/services/storyblok/api'
import { ORIGIN_URL } from '@/utils/PageLink'

const removeTrailingSlash = (url) => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const generateSiteMap = (pages) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
          <url>
            <loc>${`${ORIGIN_URL}/${removeTrailingSlash(page.full_slug)}`}</loc>
          </url>
        `
       })
       .join('')}
    </urlset>
 `
}

const SiteMap = () => {
  // getServerSideProps will do the heavy lifting
}

const STORYBLOK_CACHE_VERSION = process.env.STORYBLOK_CACHE_VERSION

const getFilteredPages = async () => {
  /**
   * Sitemap should exclude pages that are:
   * - set to noindex
   * - excluded slugs
   * - draft pages
   */

  const cacheVersion = STORYBLOK_CACHE_VERSION ? parseInt(STORYBLOK_CACHE_VERSION) : NaN
  const isCacheVersionValid = !isNaN(cacheVersion)
  const cv = isCacheVersionValid ? cacheVersion : undefined

  const filteredPages = await getStoryblokApi().getAll('cdn/stories', {
    excluding_slugs: `*/reusable-blocks/*, */product-metadata/*, */manypets/*, */widget/*`,
    'filter_query[robots][not_in]': 'noindex',
    cv,
  })

  return filteredPages
}

export const getServerSideProps = async ({ res }) => {
  const pageLinks = await getFilteredPages()
  const sitemap = generateSiteMap(pageLinks)

  res.setHeader('Content-Type', 'text/xml')
  // send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
