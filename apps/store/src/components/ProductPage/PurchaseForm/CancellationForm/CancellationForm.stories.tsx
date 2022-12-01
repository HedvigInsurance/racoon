import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStoryFn } from '@storybook/react'
import { useState } from 'react'
import { CancellationForm } from './CancellationForm'

export default {
  title: 'Product Page / Cancellation Form',
  component: CancellationForm,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
  argTypes: {
    onStartDateChange: { action: 'change start date' },
    onAutoSwitchChange: { action: 'change auto switch' },
  },
} as ComponentMeta<typeof CancellationForm>

const Template: ComponentStoryFn<typeof CancellationForm> = (props) => {
  return <CancellationForm {...props} />
}

export const NoCancellation = Template.bind({})
NoCancellation.args = { option: { type: 'NONE' }, startDate: new Date() }

export const IEX: ComponentStoryFn<typeof CancellationForm> = (props) => {
  const [requested, setRequested] = useState(true)

  return (
    <CancellationForm
      {...props}
      onAutoSwitchChange={(newValue) => {
        setRequested(newValue)
        props.onAutoSwitchChange?.(newValue)
      }}
      option={{
        type: 'IEX',
        companyName: 'Folksam',
        requested,
      }}
    />
  )
}
IEX.args = { startDate: new Date() }
