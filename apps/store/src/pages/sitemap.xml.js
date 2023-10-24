import { fetchStories } from '@/services/storyblok/storyblok'
import { ORIGIN_URL } from '@/utils/PageLink'

const generateSiteMap = (pages) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
          <url>
            <loc>${`${ORIGIN_URL}/${page.full_slug}`}</loc>
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

  let response = {}
  let filteredPages = []
  let currentPage = 1
  let perPage = 100
  let paginating = false

  const cacheVersion = STORYBLOK_CACHE_VERSION ? parseInt(STORYBLOK_CACHE_VERSION) : NaN
  const isCacheVersionValid = !isNaN(cacheVersion)
  const cv = isCacheVersionValid ? cacheVersion : undefined

  while (!paginating) {
    response = await fetchStories({
      excluding_slugs: `*/reusable-blocks/*, */product-metadata/*, */manypets/*`,
      'filter_query[robots][not_in]': 'noindex',
      page: currentPage,
      per_page: perPage,
      cv,
    })
    filteredPages.push(...response.data.stories)
    paginating = response.headers.total <= currentPage * perPage
    currentPage++
  }

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
