import { Meta, StoryFn } from '@storybook/react'
import { Space } from 'ui'
import { CardContent } from './Card'
import { SelectableCard } from './SelectableCard'
import { SelectableCardGroup } from './SelectableCardGroup'

export default {
  title: 'Card / Selectable Card ',
  component: SelectableCardGroup,
  args: {},
  argsTypes: { onChange: { action: 'onChange' } },
} as Meta<typeof SelectableCardGroup>

const RadioTemplate: StoryFn<typeof SelectableCardGroup> = (args) => {
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
