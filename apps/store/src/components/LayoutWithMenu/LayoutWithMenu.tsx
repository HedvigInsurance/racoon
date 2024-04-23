import { clsx } from 'clsx'
import { Fragment, type ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { wrapper } from '@/components/LayoutWithMenu/LayoutWithMenu.css'
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import type { GlobalProductMetadata } from './fetchProductMetadata'
import { GLOBAL_PRODUCT_METADATA_PROP_NAME } from './fetchProductMetadata'
import { useHydrateProductMetadata } from './productMetadataHooks'

type LayoutWithMenuProps = {
  children: ReactElement<{
    className: string
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
    globalStory: GlobalStory | undefined
  }>
  hideFooter?: boolean
  hideMenu?: boolean
}

export const LayoutWithMenu = (props: LayoutWithMenuProps) => {
  const { globalStory, className } = props.children.props

  useHydrateProductMetadata(props.children.props[GLOBAL_PRODUCT_METADATA_PROP_NAME])

  // Happens for transitions from pages with layout to pages without layout
  if (!globalStory) return null

  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  return (
    <>
      <div className={clsx(wrapper, className)}>
        {!props.hideMenu &&
          headerBlock.map((nestedBlock) => (
            <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        {props.children}
        {!props.hideFooter &&
          footerBlock.map((nestedBlock) => (
            <FooterBlock key={nestedBlock._uid} blok={nestedBlock} />
          ))}
      </div>
    </>
  )
}
