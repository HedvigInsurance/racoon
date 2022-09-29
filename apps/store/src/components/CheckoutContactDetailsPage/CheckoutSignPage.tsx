import styled from '@emotion/styled'
import { setCookie } from 'cookies-next'
import { Button, InputField, Space } from 'ui'
import { AUTH_COOKIE_KEY } from '@/services/apollo/client'
import { CheckoutContactDetailsPageProps } from './CheckoutContactDetails.types'
import { CheckoutContactDetailsPageLayout } from './CheckoutContactDetailsPageLayout'
import { useHandleSubmitContactDetailsAndSign } from './useHandleSubmitContactDetailsAndSign'

const MAX_AGE = 60 * 60 * 24 // 24 hours

export const CheckoutSignPage = ({
  checkoutId,
  checkoutSigningId,
  prefilledData,
  onSuccess: onSignSuccess,
}: CheckoutContactDetailsPageProps) => {
  const [handleSubmit, loading] = useHandleSubmitContactDetailsAndSign({
    checkoutId,
    checkoutSigningId,
    onSuccess(accessToken) {
      setCookie(AUTH_COOKIE_KEY, accessToken, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })
      onSignSuccess()
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      <CheckoutContactDetailsPageLayout
        Footer={
          <Space y={1.5}>
            <MutedText>
              By clicking &quot;Sign with BankID&quot; I confirm that I have read and understood the
              terms and conditions, and that I approve that Hedvig handles my personal information.
            </MutedText>
            <Button type="submit" disabled={loading} fullWidth>
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
    </form>
  )
}

const MutedText = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[0],
  color: theme.colors.gray700,
  textAlign: 'center',
}))
