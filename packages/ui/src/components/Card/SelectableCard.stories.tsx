import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Space } from '../Space'
import { Card, CardContent } from './Card'
import { SelectableCard as SelectableCardComponent } from './SelectableCard'

export default {
  title: 'UI / Card / Selectable Card',
  component: Card,
  args: {},
  argsTypes: { onChange: { action: 'onChange' } },
} as ComponentMeta<typeof Card>

const SelectableTemplate: ComponentStory<typeof Card> = (args) => {
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
