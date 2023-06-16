import { ISbRichtext, storyblokEditable } from '@storyblok/react'
import { render, RenderOptions } from 'storyblok-rich-text-react-renderer'
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
