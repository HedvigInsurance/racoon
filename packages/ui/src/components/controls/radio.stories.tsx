import { ComponentMeta, ComponentStory } from '@storybook/react'
import Radio, { RadioProps } from './radio'

import styled from '@emotion/styled'
import { useState } from 'react'

export default {
  title: 'Radio',
  component: Radio,
  args: {
    prependLabel: false,
    disabled: false,
    checked: true,
  },
} as ComponentMeta<typeof Radio>

const TemplateContainer = styled.div`
  display: flex;
  justify-content: space-around;
  & > * {
    margin: 0 15px;
  }
`

const Template: ComponentStory<typeof Radio> = (args) => {
  const [checked, setChecked] = useState(args.checked)
  const onChange = () => setChecked(!checked)
  return (
    <TemplateContainer>
      <Radio {...args} checked={checked} onChange={onChange} />
      <Radio {...args} checked={checked} onChange={onChange} label="Label" />
      <Radio {...args} checked={checked} onChange={onChange} label="Label" prependLabel />
    </TemplateContainer>
  )
}

export const Default = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Label',
  disabled: true,
}
