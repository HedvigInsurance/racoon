import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Spacing } from '../Spacing/Spacing'
import { SelectableCard as SelectableCardComponent } from './SelectableCard'
import { SelectableCardGroup as SelectableCardGroupComponent } from './SelectableCardGroup'

export default {
  title: 'UI / Card / Selectable Card',
  component: SelectableCardComponent,
  args: {
    bordered: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "`<SelectableCard>` can be used as is, and get an update on when it's selected, or through a `<SelectableCardGroup>`, and then it behaves as a radio button.",
      },
    },
  },
  argTypes: {
    id: {
      table: { disable: true },
    },
    name: {
      table: { disable: true },
    },
    type: {
      table: { disable: true },
    },
  },
} as ComponentMeta<typeof SelectableCardComponent>

const Template: ComponentStory<typeof SelectableCardComponent> = (args) => {
  const [firstIsSelected, setFirstIsSelected] = useState(false)
  const [secondIsSelected, setSecondIsSelected] = useState(false)
  const [thirdIsSelected, setThirdIsSelected] = useState(false)

  return (
    <Spacing direction="vertical">
      <SelectableCardComponent
        {...args}
        selected={firstIsSelected}
        onChange={setFirstIsSelected}
        id="first"
      >
        I&apos;m a card!
      </SelectableCardComponent>
      <SelectableCardComponent
        {...args}
        selected={secondIsSelected}
        onChange={setSecondIsSelected}
        title="This is card title"
        size="md"
        id="second"
      >
        I&apos;m a medium sized card!
      </SelectableCardComponent>
      <SelectableCardComponent
        {...args}
        selected={thirdIsSelected}
        onChange={setThirdIsSelected}
        title="This is card title"
        size="lg"
        extra="399 SEK/mth"
        id="third"
      >
        I&apos;m a medium sized card with extra content
      </SelectableCardComponent>
    </Spacing>
  )
}

export const SelectableCard = Template.bind({})

const GroupTemplate: ComponentStory<typeof SelectableCardComponent> = (args) => {
  return (
    <Spacing>
      <SelectableCardGroupComponent
        onChange={(selectedId) => console.log(`option "${selectedId}" is selected`)}
      >
        <SelectableCardComponent {...args} id="first">
          I&apos;m a card!
        </SelectableCardComponent>
        <SelectableCardComponent {...args} title="This is card title" size="md" id="second">
          I&apos;m a medium sized card!
        </SelectableCardComponent>
        <SelectableCardComponent
          {...args}
          title="This is card title"
          size="lg"
          extra="399 SEK/mth"
          id="third"
        >
          I&apos;m a medium sized card with extra content
        </SelectableCardComponent>
      </SelectableCardGroupComponent>
    </Spacing>
  )
}

export const SelectableCardGroup = GroupTemplate.bind({})
