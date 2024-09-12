import { type useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { isSameLink } from '@/utils/url'


export type LinkType = 'product' | 'category'

export const getLinkType = (
  productMetadata: ReturnType<typeof useProductMetadata> = [],
  link: string,
): LinkType | 'content' => {
  const isProductLink = productMetadata?.some((product) => isSameLink(link, product.pageLink))
  if (isProductLink) {
    return 'product'
  }

  const isCategoryLink = productMetadata?.some(
    (product) => product.categoryPageLink && isSameLink(link, product.categoryPageLink),
  )
  if (isCategoryLink) {
    return 'category'
  }

  return 'content'
}
