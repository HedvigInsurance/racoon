// This whole file is a workaround for an issue where rich text field links custom properties
// are not being properly added to links (anchor tags). It was created to simplify removal
// since this can be scrapped if 'storyblok/js' package's 'storyblok-js-client' dependency gets
// bumped by Storyblok team. Refer to https://hedvig.atlassian.net/browse/GRW-2377 for more
// info.
import { RichTextSchema, ISbNode } from '@storyblok/react'
import cloneDepp from 'clone-deep'

type LinkCustomAttributes = {
  rel?: string
  title?: string
  [key: string]: any
}

type _ISbNode = Omit<ISbNode, 'attrs'> & {
  attrs: ISbNode['attrs'] & { custom?: LinkCustomAttributes; [key: string]: any }
}

export const CustomRichTextSchema = cloneDepp(RichTextSchema)
CustomRichTextSchema.marks.link = (node: _ISbNode) => {
  const attrs = { ...node.attrs }
  const { linktype = 'url' } = node.attrs

  if (isEmailLinkType(linktype)) {
    attrs.href = `mailto:${attrs.href}`
  }

  if (attrs.anchor) {
    attrs.href = `${attrs.href}#${attrs.anchor}`
    delete attrs.anchor
  }

  if (attrs.custom) {
    for (const key in attrs.custom) {
      attrs[key] = attrs.custom[key]
    }
    delete attrs.custom
  }

  return {
    tag: [
      {
        tag: 'a',
        attrs: attrs,
      },
    ],
  }
}

const isEmailLinkType = (type: string) => type === 'email'
