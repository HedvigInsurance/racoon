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

const Template: ComponentStory<typeof TextField> = (props) => {
  return (
    <>
      <TextField {...props} />
      <div style={{ marginTop: '2rem' }}></div>
      <TextField {...props} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Name',
}
