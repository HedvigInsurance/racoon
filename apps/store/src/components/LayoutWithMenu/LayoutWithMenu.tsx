import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { GlobalProductMetadata, GLOBAL_PRODUCT_METADATA_PROP_NAME } from './fetchProductMetadata'
import { useHydrateProductMetadata } from './ProductMetadataContext'

const Wrapper = styled.div({
  minHeight: '100vh',
  isolation: 'isolate',
})

type LayoutWithMenuProps = {
  children: ReactElement<
    StoryblokPageProps & {
      className: string
      [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
    }
  >
  overlayMenu?: boolean
  hideFooter?: boolean
}

export const LayoutWithMenu = ({
  children,
  overlayMenu = false,
  hideFooter = false,
}: LayoutWithMenuProps) => {
  const { story, globalStory, className } = children.props

  useHydrateProductMetadata(children.props[GLOBAL_PRODUCT_METADATA_PROP_NAME])
  const handleLocaleChange = useChangeLocale(story)

  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  const showFooter = !hideFooter && !story.content.hideFooter

  return (
    <Wrapper className={className}>
      {!story.content.hideMenu &&
        headerBlock.map((nestedBlock) => (
          <HeaderBlock
            key={nestedBlock._uid}
            blok={nestedBlock}
            overlay={story.content.overlayMenu ?? overlayMenu}
            static={isProductStory(story)}
          />
        ))}
      {children}
      {showFooter &&
        footerBlock.map((nestedBlock) => (
          <FooterBlock
            key={nestedBlock._uid}
            blok={nestedBlock}
            onLocaleChange={handleLocaleChange}
          />
        ))}
    </Wrapper>
  )
}
