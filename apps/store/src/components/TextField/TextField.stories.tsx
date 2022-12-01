import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TextField } from './TextField'

export default {
  title: 'TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = () => {
  return (
    <>
      <TextField />
      <div style={{ marginTop: '2rem' }}></div>
      <TextField />
      <TextField></TextField>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {}
