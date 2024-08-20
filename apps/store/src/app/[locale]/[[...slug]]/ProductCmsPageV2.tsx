import { StoryblokStory } from '@storyblok/react/rsc'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import type { ProductPageStory } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type ProductCmsPageProps = {
  locale: RoutingLocale
  story: ProductPageStory
}

export const ProductCmsPageV2 = ({ story }: ProductCmsPageProps) => {
  return (
    <>
      <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
      <DefaultDebugDialog />
    </>
  )
}
