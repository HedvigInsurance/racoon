import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Space } from '../Space'
import { CardContent } from './Card'
import { SelectableCard } from './SelectableCard'
import { SelectableCardGroup } from './SelectableCardGroup'

export default {
  title: 'UI / Card / Selectable Card ',
  component: SelectableCardGroup,
  args: {},
  argsTypes: { onChange: { action: 'onChange' } },
} as ComponentMeta<typeof SelectableCardGroup>

const RadioTemplate: ComponentStory<typeof SelectableCardGroup> = (args) => {
  return (
    <SelectableCardGroup {...args}>
      <Space y={1}>
        <SelectableCard size="md" id="first">
          <CardContent>Home insurance</CardContent>
        </SelectableCard>
        <SelectableCard size="md" id="second">
          <CardContent>
            Home insurance &amp;
            <br /> Accident insurance
          </CardContent>
        </SelectableCard>
      </Space>
    </SelectableCardGroup>
  )
}

export const AsRadioButton = RadioTemplate.bind({})
AsRadioButton.args = {
  name: 'some_name',
}
