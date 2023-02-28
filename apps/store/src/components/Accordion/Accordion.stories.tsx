import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Heading } from 'ui'
import * as Accordion from './Accordion'

export default {
  title: 'Accordion',
  component: Accordion.Root,
} as ComponentMeta<typeof Accordion.Root>

const Template: ComponentStory<typeof Accordion.Root> = () => (
  <Accordion.Root type="single" collapsible>
    <Accordion.Item value="item-1">
      <Accordion.HeaderWithTrigger>Header 1</Accordion.HeaderWithTrigger>
      <Accordion.Content>
        Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop.
        Lorem ipsum dolor sit amet, florrum plorrum.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.HeaderWithTrigger>Header 2</Accordion.HeaderWithTrigger>
      <Accordion.Content>
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
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.HeaderWithTrigger>
        Header 3 which is really long and wraps
      </Accordion.HeaderWithTrigger>
      <Accordion.Content>
        Lorem ipsum dolor sit amet, florrum plorrum klufs grufs glufs. Nufs ep trop. Nufs ep trop.
        Lorem ipsum dolor sit amet, florrum plorrum.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
)

export const Default = Template.bind({})
Default.args = {}
