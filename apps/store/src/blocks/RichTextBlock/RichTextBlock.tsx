import { ISbRichtext, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { render, RenderOptions, MARK_LINK } from 'storyblok-rich-text-react-renderer'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { ImageBlock, ImageBlockProps } from '../ImageBlock'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: ISbRichtext
  layout?: GridColumnsField
  largeText?: boolean
}>

const richTextRenderOptions: RenderOptions = {
  blokResolvers: {
    image: (props) => <ImageBlock blok={props as ImageBlockProps['blok']} nested={true} />,
  },
  markResolvers: {
    [MARK_LINK]: (children, props) => {
      const { linktype, target, anchor, custom } = props

      let href = ''
      if (props.href) {
        href = props.href
      } else {
        console.warn(
          "[RichTextBlock]: No 'href' provided to link. This is probably a configuration issue. Using '' as placholder",
        )
      }

      if (linktype === 'email') {
        return <a href={`mailto:${href}`}>{children}</a>
      }

      const linkProps = {
        href: appendAnchor(href, anchor),
        children,
        target,
        ...custom,
      }

      // External links
      if (isExternalLink(href)) {
        return <a {...linkProps} />
      }

      // Internal links
      return <Link {...linkProps} />
    },
  },
}

const isExternalLink = (href?: string) => href?.match(/^(https?:)?\/\//)

const appendAnchor = (href: string, anchor?: string) => (anchor ? `${href}#${anchor}` : href)

export const RichTextBlock = ({ blok }: RichTextBlockProps) => {
  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1', md: '2/3', xl: '1/2' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        <RichText largeText={blok.largeText}>
          {render(blok.content, richTextRenderOptions)}
        </RichText>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
RichTextBlock.blockName = 'richText'
