import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStoryFn } from '@storybook/react'
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

export const IEX = Template.bind({})
IEX.args = { option: { type: 'IEX', companyName: 'Folksam' }, startDate: new Date() }
