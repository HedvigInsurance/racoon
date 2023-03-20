import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { TextField } from './TextField'

export default {
  title: 'Inputs/TextField',
  component: TextField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as Meta<typeof TextField>

const Template: StoryFn<typeof TextField> = ({ defaultValue, ...props }) => {
  return (
    <>
      <TextField {...props} />
      <div style={{ marginTop: '0.25rem' }}></div>
      <TextField {...props} defaultValue={defaultValue} />
      <div style={{ marginTop: '0.25rem' }}></div>
      <TextField {...props} defaultValue={defaultValue} disabled />
      <div style={{ marginTop: '0.25rem' }}></div>
      <TextField {...props} defaultValue={defaultValue} warning message="Wrong input, try again" />
    </>
  )
}

export const Large = Template.bind({})
Large.args = {
  label: 'Name',
  variant: 'large',
  defaultValue: 'John Sculley',
}

export const Small = Template.bind({})
Small.args = {
  label: 'Address',
  variant: 'small',
  defaultValue: '786 Franklin Ave.',
}

export const Number = Template.bind({})
Number.args = {
  type: 'text',
  inputMode: 'numeric',
  pattern: '[0-9]*',
  autoComplete: 'off',
  label: 'Weight',
  variant: 'large',
  defaultValue: '150',
  suffix: 'kg',
}
