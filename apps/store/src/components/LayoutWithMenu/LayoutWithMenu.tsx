import styled from '@emotion/styled'
import { StoryblokComponent } from '@storyblok/react'
import { type ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { PageStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { BreadcrumbList, BreadcrumbListItem } from './BreadcrumbList'
import { GlobalProductMetadata, GLOBAL_PRODUCT_METADATA_PROP_NAME } from './fetchProductMetadata'
import { useHydrateProductMetadata } from './ProductMetadataContext'

const Wrapper = styled.div({
  minHeight: '100vh',
  isolation: 'isolate',
})

type LayoutWithMenuProps = {
  children: ReactElement<
    Omit<StoryblokPageProps, 'story'> & {
      className: string
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
      story: PageStory | undefined
      breadcrumbs?: Array<BreadcrumbListItem>
    }
  >
  overlayMenu?: boolean
  hideFooter?: boolean
}

export const LayoutWithMenu = (props: LayoutWithMenuProps) => {
  const { story, globalStory, className, breadcrumbs } = props.children.props

  useHydrateProductMetadata(props.children.props[GLOBAL_PRODUCT_METADATA_PROP_NAME])
  const handleLocaleChange = useChangeLocale(story)

  // Announcements are added as reusable blocks for Page and ProductPage content types
  const reusableBlock = filterByBlockType(
    story?.content.announcement,
    ReusableBlockReference.blockName,
  )
  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  const showHeader = !story?.content.hideMenu
  const showMenuOverlay = story?.content.overlayMenu ?? props.overlayMenu
  const showFooter = !props.hideFooter && !story?.content.hideFooter

  const showBreadcrumbList = !story?.content.hideBreadcrumbs && breadcrumbs?.length !== 0 && story
  const breadcrumbItems = [...(breadcrumbs ?? []), ...(story ? [{ label: story.name }] : [])]

  return (
    <Wrapper className={className}>
      {reusableBlock.map((referencedBlok) => (
        <StoryblokComponent key={referencedBlok._uid} blok={referencedBlok} />
      ))}
      {showHeader &&
        headerBlock.map((nestedBlock) => (
          <HeaderBlock
            key={nestedBlock._uid}
            blok={nestedBlock}
            overlay={showMenuOverlay}
            static={story && isProductStory(story)}
          />
        ))}
      {props.children}
      {showFooter &&
        footerBlock.map((nestedBlock) => (
          <>
            {showBreadcrumbList && <BreadcrumbList items={breadcrumbItems} />}

            <FooterBlock
              key={nestedBlock._uid}
              blok={nestedBlock}
              onLocaleChange={handleLocaleChange}
            />
          </>
        ))}
    </Wrapper>
  )
}
