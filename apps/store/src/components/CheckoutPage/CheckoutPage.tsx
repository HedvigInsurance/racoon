import { Button, InputField, Space } from 'ui'
import { CheckoutPageProps } from './CheckoutPage.types'
import { CheckoutPageLayout } from './CheckoutPageLayout'

export const CheckoutPage = ({ prefilledData }: CheckoutPageProps) => {
  return (
    <CheckoutPageLayout
      Footer={
        <Button type="submit" fullWidth>
          Continue to payment
        </Button>
      }
    >
      <Space y={1}>
        <InputField
          label="National identity number (DDMMYYXXXXX)"
          name="personalNumber"
          required
          defaultValue={prefilledData.personalNumber ?? undefined}
          infoMessage={
            'We credit assess all new customers. Those who have payment remarks will in some cases be asked to pay in advance.'
          }
        />
        <InputField
          label="First name"
          name="firstName"
          required
          defaultValue={prefilledData.firstName ?? undefined}
        />
        <InputField
          label="Last name"
          name="lastName"
          required
          defaultValue={prefilledData.lastName ?? undefined}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={prefilledData.email ?? undefined}
        />
      </Space>
    </CheckoutPageLayout>
  )
}
