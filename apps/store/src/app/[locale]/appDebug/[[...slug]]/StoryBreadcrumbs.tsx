import { BreadcrumbList, BreadcrumbListItem } from '@/components/LayoutWithMenu/BreadcrumbList'
import { getParentStories } from '@/services/storyblok/storyblok.serverOnly'
import { ORIGIN_URL } from '@/utils/PageLink'
import { CmsPageRoutingParams } from './page'

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
    const parentStories = await getParentStories(slug.join('/'), { locale: props.params.locale })
    parentStories.forEach((item) => {
      const slugWithoutTrailingSlash = item.full_slug.replace(/\/$/, '')
      parentBreadcrumbs.push({
        label: item.name,
        href: `${ORIGIN_URL}/${slugWithoutTrailingSlash}`,
      })
    })
  }

  const items = [...parentBreadcrumbs, { label: props.currentPageTitle }]
  return <BreadcrumbList items={items} />
}
