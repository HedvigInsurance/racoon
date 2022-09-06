import { Button, InputField, Space } from 'ui'
import { CheckoutContactDetailsPageProps } from './CheckoutContactDetails.types'
import { CheckoutContactDetailsPageLayout } from './CheckoutContactDetailsPageLayout'

export const CheckoutContactDetailsPage = ({ prefilledData }: CheckoutContactDetailsPageProps) => {
  return (
    <CheckoutContactDetailsPageLayout
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
    </CheckoutContactDetailsPageLayout>
  )
}
