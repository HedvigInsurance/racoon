import type { StoryblokPageItem } from "./types"

interface FetchOptions {
  preview?: boolean;
  variables?: any;
}

const fetchAPI = async (query: string, { variables, preview = false }: FetchOptions = {}) => {
  const res = await fetch('https://gapi.storyblok.com/v1/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: process.env.STORYBLOK_API_TOKEN as string,
      Version: preview ? 'draft' : 'published',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

interface StoryblokLinkItem {
  slug: string
  isFolder: boolean
  published: boolean
}

export const getAllLinksWithSlug = async () => {
  const data = await fetchAPI(`
    {
      Links {
        items {
          slug
          isFolder
          published
        }
      }
    }
  `)
  return data.Links.items as Array<StoryblokLinkItem>
}

export const getPageBySlug = async (slug: string, { preview = false } = {}) => {
  const data = await fetchAPI(`
    query PageItemBySlug($slug: ID!) {
      PageItem(id: $slug) {
        id
        name
        full_slug
        content {
          _uid
          page_title
          component
          hide_footer
          robots
          seo_meta_title
          seo_meta_og_image
          seo_meta_og_title
          seo_meta_description
          seo_meta_og_description
          body
        }
      }
    }
  `, {
    variables: {
      slug,
    },
    preview,
  })

  return data.PageItem as StoryblokPageItem
}
