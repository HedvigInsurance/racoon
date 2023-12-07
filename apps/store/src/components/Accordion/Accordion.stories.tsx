import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Heading } from 'ui'
import * as Accordion from './Accordion'

const ACCORDION_ITEMS = [
  {
    value: 'item-1',
    title: 'Vad ingår i en hemförsäkring?',
    content:
      'Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop. Lorem ipsum dolor sit amet, florrum plorrum.',
  },
  {
    value: 'item-2',
    title: 'Måste man ha hemförsäkring?',
    content: (
      <>
        Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop.
        Lorem ipsum dolor sit amet, florrum plorrum <a href="#">Some link</a>.
        <Heading variant="serif.20" as="h4">
          Covered
        </Heading>
        <ul>
          <li>Lorem ploran</li>
          <li>Ipsum dolor</li>
          <li>Ipsum dolor</li>
        </ul>
      </>
    ),
  },
  {
    value: 'item-3',
    title: 'Vad kostar en hemförsäkring?',
    content: (
      <>
        Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop.
        Lorem ipsum dolor sit amet, florrum plorrum.
        <Heading variant="serif.20" as="h4">
          Covered
        </Heading>
        <ul>
          <li>Lorem ploran</li>
          <li>Ipsum dolor</li>
          <li>Ipsum dolor</li>
        </ul>
      </>
    ),
  },
]

export default {
  component: Accordion.Root,
  parameters: {
    grid: { width: '1/2' },
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/qUhLjrKl98PAzHov9ilaDH/Hedvig-UI-Kit?type=design&node-id=673%3A5030',
    },
  },
} as Meta<typeof Accordion.Root>

const Template: StoryFn<typeof Accordion.Root> = () => {
  const [openedItem, setOpenedItem] = useState<string>()

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openedItem}
      onValueChange={(value) => setOpenedItem(value)}
    >
      {ACCORDION_ITEMS.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.HeaderWithTrigger>{item.title}</Accordion.HeaderWithTrigger>
          <Accordion.Content open={openedItem === item.value}>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export const Default = Template.bind({})
Default.args = {}
