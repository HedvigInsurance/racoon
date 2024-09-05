'use client'
import styled from '@emotion/styled'
import { type ISbRichtext, storyblokEditable } from '@storyblok/react'
import {
  MarkTypes,
  richTextResolver,
  type StoryblokRichTextDocumentNode,
  type StoryblokRichTextOptions,
} from '@storyblok/richtext'
import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
// import { render, type RenderOptions, MARK_LINK } from 'storyblok-rich-text-react-renderer'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkRel } from '@/services/storyblok/Storyblok.helpers'
import { ImageBlock, type ImageBlockProps } from '../ImageBlock'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: StoryblokRichTextDocumentNode
  layout?: GridColumnsField
  largeText?: boolean
}>

const RENDER_OPTIONS: RenderOptions = {
  // blokResolvers: {
  //   image: (props) => <ImageBlock blok={props as ImageBlockProps['blok']} nested={true} />,
  // },
  resolvers: {
    [MarkTypes.LINK]: (node) => {
      // const { linktype, target, anchor, custom } = node

      let href = ''
      if (node.attrs?.href) {
        href = node.attrs.href
      } else {
        console.warn(
          "[RichTextBlock]: No 'href' provided to link. This is probably a configuration issue. Using '' as placholder",
        )
      }

      if (node.attrs?.linktype === 'email') {
        return <a href={`mailto:${href}`}>{node.children}</a>
      }

      const linkProps = {
        href: appendAnchor(href, node.attrs?.anchor),
        children: node.children,
        target: node.attrs?.target,
        ...node.attrs?.custom,
      }

      // External links
      if (isExternalLink(href)) {
        const rel = getLinkRel(linkProps)
        return <a {...linkProps} rel={rel} />
      }

      // Internal links
      return <Link {...linkProps} />
    },
  },
}

const isExternalLink = (href?: string) => href?.match(/^(https?:)?\/\//)

const appendAnchor = (href: string, anchor?: string) => (anchor ? `${href}#${anchor}` : href)

export const RichTextBlock = ({ blok, nested }: RichTextBlockProps) => {
  // const content = useMemo(() => renderRichText(blok.content), [blok.content])
  // @ts-expect-error not supported by Vanilla-extract types yet
  const content = richTextResolver().render(blok.content) as ReactNode

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

type RenderOptions = StoryblokRichTextOptions<React.ReactElement>

// const RENDER_OPTIONS: RenderOptions = {
//   // blokResolvers: {
//   //   image: (props) => <ImageBlock blok={props as ImageBlockProps['blok']} nested={true} />,
//   // },
//   resolvers: {
//     [MarkTypes.LINK]: (node) => {
//       // const { linktype, target, anchor, custom } = node

//       let href = ''
//       if (node.attrs?.href) {
//         href = node.attrs.href
//       } else {
//         console.warn(
//           "[RichTextBlock]: No 'href' provided to link. This is probably a configuration issue. Using '' as placholder",
//         )
//       }

//       if (node.attrs?.linktype === 'email') {
//         return <a href={`mailto:${href}`}>{node.children}</a>
//       }

//       const linkProps = {
//         href: appendAnchor(href, node.attrs?.anchor),
//         children: node.children,
//         target: node.attrs?.target,
//         ...node.attrs?.custom,
//       }

//       // External links
//       if (isExternalLink(href)) {
//         const rel = getLinkRel(linkProps)
//         return <a {...linkProps} rel={rel} />
//       }

//       // Internal links
//       return <Link {...linkProps} />
//     },
//   },
// }

// export const renderRichText = (content: ISbRichtext, renderOptions: RenderOptions = RENDER_OPTIONS) =>
//   richTextResolver(renderOptions).render(content) as ReactNode
