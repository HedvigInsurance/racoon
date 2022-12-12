import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = ({ defaultValue, ...props }) => {
  return (
    <>
      <TextField {...props} />
      <div style={{ marginTop: '0.25rem' }}></div>
      <TextField {...props} defaultValue={defaultValue} />
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
