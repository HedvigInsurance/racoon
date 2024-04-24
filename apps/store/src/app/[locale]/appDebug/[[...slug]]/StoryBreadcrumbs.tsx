import {
  type BreadcrumbListItem,
  PageBreadcrumbs,
} from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { getParentStories } from '@/services/storyblok/storyblok.serverOnly'
import { ORIGIN_URL } from '@/utils/PageLink'
import type { CmsPageRoutingParams } from './page'

type Props = {
  params: CmsPageRoutingParams
  currentPageTitle: string
}
export async function StoryBreadcrumbs(props: Props) {
  const { slug } = props.params
  if (!Array.isArray(slug)) {
    throw new Error(`Page slug expected, got: ${slug}`)
  }

  const parentBreadcrumbs: Array<BreadcrumbListItem> = []
  if (slug.length > 1) {
    try {
      const parentStories = await getParentStories(slug.join('/'), { locale: props.params.locale })
      parentStories.forEach((item) => {
        const slugWithoutTrailingSlash = item.full_slug.replace(/\/$/, '')
        parentBreadcrumbs.push({
          label: item.name,
          href: `${ORIGIN_URL}/${slugWithoutTrailingSlash}`,
        })
      })
    } catch (err) {
      console.log(`Failed to get breadcrumbs for ${JSON.stringify(props.params)}`, err)
      return null
    }
  }

  const items = [...parentBreadcrumbs, { label: props.currentPageTitle }]
  return <PageBreadcrumbs items={items} />
}
