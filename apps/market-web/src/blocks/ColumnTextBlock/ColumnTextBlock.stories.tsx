import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { minimalColorMap } from '@/helpers/storybook'
import { MarkdownHtmlComponent } from '@/services/storyblok/types'
import { ColumnTextBlock } from './ColumnTextBlock'

const exampleText: MarkdownHtmlComponent = {
  _uid: '1234',
  html: '<p>Vi har lagt mycket tid på att utveckla en försäkring anpassad efter hur våra medlemmar lever. Hedvig erbjuder innboforsikring, reiseforsikring eller kombo, så att du kan vara säker på att få snabb, trygg och personlig hjälp, oavsett var du befinner dig.</p>',
  original:
    '<p>Vi har lagt mycket tid på att utveckla en försäkring anpassad efter hur våra medlemmar lever. Hedvig erbjuder innboforsikring, reiseforsikring eller kombo, så att du kan vara säker på att få snabb, trygg och personlig hjälp, oavsett var du befinner dig.</p>',
  plugin: 'markdown-html',
}

export default {
  title: 'Market Web / Blocks / ColumnTextBlock',
  component: ColumnTextBlock,
  args: {
    _uid: '1234',
    component: 'column_text_block',
    color: minimalColorMap['standard'],
    text_one: exampleText,
    text_two: exampleText,
  },
  argTypes: {
    color: {
      options: Object.keys(minimalColorMap),
      mapping: minimalColorMap,
    },
  },
  parameters: {
    layout: 'padded',
  },
} as ComponentMeta<typeof ColumnTextBlock>

const Template: ComponentStory<typeof ColumnTextBlock> = (args) => <ColumnTextBlock {...args} />

export const Default = Template.bind({})
