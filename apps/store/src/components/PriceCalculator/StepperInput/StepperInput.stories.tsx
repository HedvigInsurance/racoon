import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { StepperInput } from './StepperInput'

export default {
  title: 'Inputs / Stepper Input',
  component: StepperInput,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof StepperInput>

const Template: StoryFn<typeof StepperInput> = (props) => {
  return <StepperInput {...props} />
}
export const Default = Template.bind({})
Default.args = {
  name: 'numberCoInsured',
  max: 5,
  optionLabel(count) {
    return `${count} person${count === 1 ? '' : 's'}`
  },
}
