import { ISbRichtext, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { render, RenderOptions, MARK_LINK } from 'storyblok-rich-text-react-renderer'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { ImageBlock, ImageBlockProps } from '../ImageBlock'
import { Layout } from '../TextContentBlock'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: ISbRichtext
  layout?: Layout
  largeText?: boolean
}>

export const richTextRenderOptions: RenderOptions = {
  blokResolvers: {
    image: (props) => <ImageBlock blok={props as ImageBlockProps['blok']} nested={true} />,
  },
  markResolvers: {
    [MARK_LINK]: (children, props) => {
      const { linktype, href, target } = props
      if (linktype === 'email') {
        return <a href={`mailto:${href}`}>{children}</a>
      }

      // External links
      if (href?.match(/^(https?:)?\/\//)) {
        return (
          <a href={href} target={target}>
            {children}
          </a>
        )
      }

      // Internal links
      if (href) {
        return <Link href={href}>{children}</Link>
      }

      return null
    },
  },
}

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
