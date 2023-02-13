import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { GlobalProductMetadata, GLOBAL_PRODUCT_METADATA_PROP_NAME } from './fetchProductMetadata'
import { ProductMetadataProvider } from './ProductMetadataContext'

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
}

export const LayoutWithMenu = ({ children, overlayMenu = false }: LayoutWithMenuProps) => {
  const {
    story,
    globalStory,
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: globalProductMetadata,
    className,
  } = children.props
  const headerBlock = filterByBlockType(globalStory?.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory?.content.footer, FooterBlock.blockName)

  const handleLocaleChange = useChangeLocale(story)

  return (
    <ProductMetadataProvider value={globalProductMetadata}>
      <Wrapper className={className}>
        {!(story && story.content.hideMenu) &&
          headerBlock?.map((nestedBlock) => (
            <HeaderBlock
              key={nestedBlock._uid}
              blok={nestedBlock}
              overlay={story?.content.overlayMenu ?? overlayMenu}
            />
          ))}
        {children}
        {!(story && story.content.hideFooter) &&
          footerBlock?.map((nestedBlock) => (
            <FooterBlock
              key={nestedBlock._uid}
              blok={nestedBlock}
              onLocaleChange={handleLocaleChange}
            />
          ))}
      </Wrapper>
    </ProductMetadataProvider>
  )
}
