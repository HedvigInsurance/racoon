import { ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { ToggleButton, ToggleButtonProps } from './ToggleButton'

const config = {
  title: 'UI / Button / ToggleButton',
  component: ToggleButton,
}
export default config

const Template: ComponentStory<typeof ToggleButton> = (props: ToggleButtonProps) => {
  const initialText = 'Hello'
  const [text, setText] = useState(`${initialText} ${props.initialActive ? ' active' : ''}`)

  const handleToggle = (isActive: boolean) => {
    setText(`${initialText}${isActive ? ' active' : ''}`)
  }

  return (
    <ToggleButton {...props} onToggle={handleToggle}>
      {text}
    </ToggleButton>
  )
}

export const Default = Template.bind({})
export const InitialActive = Template.bind({})
InitialActive.args = {
  initialActive: true,
}
