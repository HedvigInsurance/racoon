import { getFilteredPageLinks } from '@/services/storyblok/storyblok'

const BASE_URL = 'https://www.hedvig.com'

const generateSiteMap = (pages) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
          <url>
            <loc>${`${BASE_URL}/${page.link.slug}`}</loc>
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

export const getServerSideProps = async ({ res }) => {
  const pageLinks = await getFilteredPageLinks()
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
