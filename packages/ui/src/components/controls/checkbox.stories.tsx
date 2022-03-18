import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Checkbox } from './checkbox'
import styled from '@emotion/styled'
import { useState } from 'react'

export default {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    prependLabel: false,
    disabled: false,
    checked: true,
  },
} as ComponentMeta<typeof Checkbox>

const TemplateContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-around',
  ' & > *': {
    margin: '0 15px;',
  },
})

const Template: ComponentStory<typeof Checkbox> = (args) => {
  const [checked, setChecked] = useState(args.checked)
  const onChange = () => setChecked(!checked)
  return (
    <TemplateContainer>
      <Checkbox {...args} checked={checked} onChange={onChange} />
      <Checkbox {...args} checked={checked} onChange={onChange} label="Label" />
      <Checkbox {...args} checked={checked} onChange={onChange} label="Label" prependLabel />
    </TemplateContainer>
  )
}

export const Default = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Label',
  disabled: true,
}
