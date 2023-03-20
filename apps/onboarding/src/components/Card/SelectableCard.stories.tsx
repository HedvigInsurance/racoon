import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Space } from 'ui/src/components/Space'
import { Card, CardContent } from './Card'
import { SelectableCard as SelectableCardComponent } from './SelectableCard'

export default {
  title: 'Card / Selectable Card',
  component: Card,
  args: {},
  argsTypes: { onChange: { action: 'onChange' } },
} as Meta<typeof Card>

const SelectableTemplate: StoryFn<typeof Card> = (args) => {
  const [isFirstChecked, setIsFirstChecked] = useState(false)
  const [isSecondChecked, setIsSecondChecked] = useState(false)

  return (
    <Space y={1}>
      <SelectableCardComponent
        {...args}
        checked={isFirstChecked}
        onChange={(checked) => setIsFirstChecked(Boolean(checked))}
        size="sm"
      >
        <CardContent>I&apos;m a selectable card!</CardContent>
      </SelectableCardComponent>
      <SelectableCardComponent
        {...args}
        checked={isSecondChecked}
        onChange={(checked) => setIsSecondChecked(Boolean(checked))}
        size="md"
      >
        <CardContent>I&apos;m a also a selectable card!</CardContent>
      </SelectableCardComponent>
    </Space>
  )
}

export const AsCheckbox = SelectableTemplate.bind({})
