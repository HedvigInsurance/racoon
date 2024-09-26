import { StoryblokComponent } from '@storyblok/react'
import {
  BlockTypes,
  type LinkNode,
  MarkTypes,
  richTextResolver,
  type StoryblokRichTextNode,
} from '@storyblok/richtext'
import Link from 'next/link'
import { createElement, type ReactElement } from 'react'
import { type StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkRel } from '@/services/storyblok/Storyblok.helpers'
import { ImageBlock } from '../ImageBlock'
import { convertAttributesInElement } from './richTextUtils'

export const renderRichTextToJsx = (content: StoryblokRichTextNode): ReactElement => {
  const html = resolver.render(content as unknown as StoryblokRichTextNode<ReactElement>)
  const formattedHtml = convertAttributesInElement(html)
  return formattedHtml
}

export const renderRichTextToString = (content: StoryblokRichTextNode): string =>
  richTextResolver<string>().render(content)

const resolver = richTextResolver({
  renderFn: createElement,
  resolvers: {
    // @ts-expect-error type mismatch on linktype property, no idea how to fix this cheaply
    [MarkTypes.LINK]: (node: LinkNode<ReactElement>) => {
      let href = ''
      if (node.attrs.href) {
        href = node.attrs.href
      } else {
        console.warn(
          "[RichTextBlock]: No 'href' provided to link. This is probably a configuration issue. Using '' as placeholder",
        )
      }

      const linkProps = {
        href: appendAnchor(href, node.attrs.anchor),
        children: node.text,
        target: node.attrs.target,
        ...node.attrs.custom,
      }

      if (node.attrs.linktype === 'email') {
        linkProps.href = `mailto:${href}`
        return <a key={node.attrs.uuid} {...linkProps} />
      } else if (isExternalLink(href)) {
        // External links
        const rel = getLinkRel(linkProps)
        return <a key={node.attrs.uuid} {...linkProps} rel={rel} />
      } else {
        // Internal links
        return <Link key={node.attrs.uuid} {...linkProps} />
      }
    },
    [MarkTypes.STYLED]: (node) => {
      return (
        <span key={node.text} className={node.attrs?.class}>
          {node.text}
        </span>
      )
    },
    [BlockTypes.IMAGE]: (node: StoryblokRichTextNode<ReactElement>) => {
      const attrs = node.attrs!
      const blok = {
        image: {
          alt: attrs.alt,
          filename: attrs.src,
        } as StoryblokAsset,
      }
      return <ImageBlock key={`image-${attrs.id}`} blok={blok} nested={true} />
    },
    [BlockTypes.COMPONENT]: componentResolver,
  },
  // No need to escape quote marks [\'\"], it breaks final result
  // From safety perspective quotes should only be escaped in attribute values
  textFn: (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
})

function componentResolver(node: StoryblokRichTextNode<ReactElement>) {
  // Convert this to use React.createElement or JSX
  // Example with JSX:
  return createElement(StoryblokComponent, { blok: node.attrs?.body[0], id: node.attrs?.id })
}

const isExternalLink = (href?: string) => href?.match(/^(https?:)?\/\//)

const appendAnchor = (href: string, anchor?: string) => (anchor ? `${href}#${anchor}` : href)
