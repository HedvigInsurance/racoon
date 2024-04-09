import type { NextPageWithLayout } from 'next'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { StoryblokPage } from '@/components/StoryblokPage'
import type { StoryblokPageProps } from '@/services/storyblok/storyblok'

export const CarBuyerCmsPage: NextPageWithLayout<StoryblokPageProps> = (props) => (
  <StoryblokPage {...props} />
)

CarBuyerCmsPage.getLayout = (children) => (
  <LayoutWithMenu hideFooter={true} hideMenu={true}>
    {children}
  </LayoutWithMenu>
)
