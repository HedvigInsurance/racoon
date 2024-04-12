import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import { TextField } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'Inputs/TextField',
  component: TextField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
    grid: { width: '1/3' },
  },
}

export default meta

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

export const Large = {
  render: Template,
  args: {
    label: 'Name',
    variant: 'large',
    defaultValue: 'John Sculley',
  },
}

export const Small = {
  render: Template,
  args: {
    label: 'Address',
    variant: 'small',
    defaultValue: '786 Franklin Ave.',
  },
}

export const Number = {
  render: Template,
  args: {
    type: 'text',
    inputMode: 'numeric',
    pattern: '[0-9]*',
    autoComplete: 'off',
    label: 'Weight',
    variant: 'large',
    defaultValue: '150',
    suffix: 'kg',
  },
}
