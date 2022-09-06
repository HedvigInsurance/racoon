import styled from '@emotion/styled'
import { Button, InputField, Space } from 'ui'
import { CheckoutContactDetailsPageProps } from './CheckoutContactDetails.types'
import { CheckoutContactDetailsPageLayout } from './CheckoutContactDetailsPageLayout'

export const CheckoutSignPage = ({ prefilledData }: CheckoutContactDetailsPageProps) => {
  return (
    <CheckoutContactDetailsPageLayout
      Footer={
        <Space y={1.5}>
          <MutedText>
            By clicking &quot;Sign with BankID&quot; I confirm that I have read and understood the
            terms and conditions, and that I approve that Hedvig handles my personal information.
          </MutedText>
          <Button type="submit" fullWidth>
            Sign with BankID
          </Button>
        </Space>
      }
    >
      <Space y={1}>
        <InputField
          label="Personal number"
          name="personalNumber"
          required
          defaultValue={prefilledData.personalNumber ?? undefined}
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

const MutedText = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[0],
  color: theme.colors.gray700,
  textAlign: 'center',
}))
