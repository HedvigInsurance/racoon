import styled from '@emotion/styled'
import { type ISbRichtext, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
import {
  render,
  type RenderOptions,
  MARK_LINK,
  MARK_TEXT_STYLE,
} from 'storyblok-rich-text-react-renderer'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkRel } from '@/services/storyblok/Storyblok.helpers'
import { ImageBlock, type ImageBlockProps } from '../ImageBlock'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: ISbRichtext
  layout?: GridColumnsField
  largeText?: boolean
}>

export const RichTextBlock = ({ blok, nested }: RichTextBlockProps) => {
  const content = useMemo(() => renderRichText(blok.content), [blok.content])

  if (nested) {
    return <NestedRichText largeText={blok.largeText}>{content}</NestedRichText>
  }

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1', md: '2/3', xl: '1/2' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        <RichText largeText={blok.largeText}>{content}</RichText>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
RichTextBlock.blockName = 'richText'

const NestedRichText = styled(RichText)({
  ':is([data-large-text=true], &) :is(h2, h3, h4):first-of-type': {
    marginTop: 0,
  },
})

const RENDER_OPTIONS: RenderOptions = {
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
        const rel = getLinkRel(linkProps)
        return <a {...linkProps} rel={rel} />
      }

      // Internal links
      return <Link {...linkProps} />
    },
    [MARK_TEXT_STYLE]: (children, { color }) => {
      // Avoids hydration errors when 'color' is not valid: nullish or empty string
      const props = color ? { style: { color } } : {}

      return <span {...props}>{children}</span>
    },
  },
}

const isExternalLink = (href?: string) => href?.match(/^(https?:)?\/\//)

const appendAnchor = (href: string, anchor?: string) => (anchor ? `${href}#${anchor}` : href)

export const renderRichText = (
  content: ISbRichtext,
  renderOptions: RenderOptions = RENDER_OPTIONS,
) => render(content, renderOptions) as ReactNode
