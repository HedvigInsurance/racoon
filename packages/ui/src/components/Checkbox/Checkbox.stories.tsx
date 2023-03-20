import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

export default {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    prependLabel: false,
    disabled: false,
    checked: true,
  },
} as Meta<typeof Checkbox>

const TemplateContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-around',
  ' & > *': {
    margin: '0 15px;',
  },
})

const Template: StoryFn<typeof Checkbox> = (args) => {
  const [checked, setChecked] = useState(args.checked)
  const onChange = () => setChecked(!checked)
  return (
    <TemplateContainer>
      <Checkbox {...args} checked={checked} onChange={onChange} />
      <Checkbox {...args} checked={checked} onChange={onChange} label="Label" />
      <Checkbox {...args} checked={checked} onChange={onChange} label="Label" prependLabel />
      <Checkbox label="Uncontrolled" prependLabel disabled={args.disabled} />
    </TemplateContainer>
  )
}

export const Default = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Label',
  disabled: true,
}
