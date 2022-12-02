import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TextField } from './TextField'

export default {
  title: 'Input/TextField',
  component: TextField,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = () => {
  return (
    <>
      <TextField />
      <div style={{ marginTop: '2rem' }}></div>
      <TextField />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Name',
}
