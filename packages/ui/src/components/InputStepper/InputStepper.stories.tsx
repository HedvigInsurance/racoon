import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputStepper } from './InputStepper'

export default {
  title: 'Input Stepper',
  component: InputStepper,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    infoMessage: { control: 'text' },
  },
} as ComponentMeta<typeof InputStepper>

const Template: ComponentStory<typeof InputStepper> = (args) => <InputStepper {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Number of insured people',
  infoMessage: 'All ages, from 2-65 years',
  min: 0,
  max: 10,
  step: 2,
}
