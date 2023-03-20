import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
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
} as Meta<typeof CancellationForm>

const Template: StoryFn<typeof CancellationForm> = (props) => {
  return <CancellationForm {...props} />
}

export const NoCancellation = Template.bind({})
NoCancellation.args = {
  option: { type: ExternalInsuranceCancellationOption.None },
  startDate: new Date(),
}

export const IEX: StoryFn<typeof CancellationForm> = (props) => {
  const [requested, setRequested] = useState(true)

  return (
    <CancellationForm
      {...props}
      onAutoSwitchChange={(newValue) => {
        setRequested(newValue)
        props.onAutoSwitchChange?.(newValue)
      }}
      option={{
        type: ExternalInsuranceCancellationOption.Iex,
        companyName: 'Folksam',
        requested,
      }}
    />
  )
}
IEX.args = { startDate: new Date() }

export const BankSignering: StoryFn<typeof CancellationForm> = (props) => {
  const [requested, setRequested] = useState(true)

  return (
    <CancellationForm
      {...props}
      onAutoSwitchChange={(newValue) => {
        setRequested(newValue)
        props.onAutoSwitchChange?.(newValue)
      }}
      option={{
        type: ExternalInsuranceCancellationOption.Banksignering,
        companyName: 'Folksam',
        requested,
      }}
    />
  )
}
BankSignering.args = { startDate: new Date() }

export const BankSigneringInvalidStartDate: StoryFn<typeof CancellationForm> = (props) => {
  return (
    <CancellationForm
      {...props}
      option={{
        type: ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate,
        companyName: 'Trygg Hansa',
      }}
    />
  )
}
BankSigneringInvalidStartDate.args = { startDate: new Date() }
