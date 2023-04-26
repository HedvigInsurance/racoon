import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Heading } from 'ui'
import * as Accordion from './Accordion'

const ACCORDION_ITEMS = [
  {
    value: 'item-1',
    title: 'Header 1',
    content:
      'Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop. Lorem ipsum dolor sit amet, florrum plorrum.',
  },
  {
    value: 'item-2',
    title: 'Header 2',
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
    title: 'Header 3 which is really long and wraps',
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
  title: 'Accordion',
  component: Accordion.Root,
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
