import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowForwardIcon, Button, Heading, HedvigLogo, InputField, Space } from 'ui'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Text } from '@/components/Text/Text'
import { CheckoutSigningStatus } from '@/services/apollo/generated'
import { PageLink } from '@/utils/PageLink'
import { OfferInventoryItem } from '../CartInventory/OfferInventoryItem'
import { FormElement } from './CheckoutPage.constants'
import { CheckoutPageProps } from './CheckoutPage.types'

const CheckoutPage = (props: CheckoutPageProps) => {
  const { cart, loading, prefilledData, userError } = props

  return (
    <>
      <Space y={1}>
        <Header>
          <Link href={PageLink.cart()} passHref legacyBehavior>
            <StyledLink>
              <ArrowBackIcon size="1rem" />
            </StyledLink>
          </Link>
          <HedvigLogo width={82} />
        </Header>

        <Main>
          <Space y={2}>
            <Space y={1}>
              <MainTop>
                <Heading as="h1" variant="standard.24">
                  Checkout
                </Heading>
              </MainTop>

              <CartInventory cart={cart}>
                {(offer) => <OfferInventoryItem offer={offer} />}
              </CartInventory>
            </Space>

            <Section as="section" y={1}>
              <Heading as="h2" variant="standard.24">
                Your contact info
              </Heading>
              <PersonalNumberField
                name={FormElement.PersonalNumber}
                required
                defaultValue={prefilledData.personalNumber ?? undefined}
                placeholder="ÅÅMMDD-XXXX"
              />
              <InputField
                label="First Name"
                name={FormElement.FirstName}
                type="text"
                required
                defaultValue={prefilledData.firstName ?? undefined}
              />
              <InputField
                label="Last Name"
                name={FormElement.LastName}
                type="text"
                required
                defaultValue={prefilledData.lastName ?? undefined}
              />
              <InputField
                label="Email"
                name={FormElement.Email}
                type="email"
                required
                defaultValue={prefilledData.email ?? undefined}
              />
              <InputField
                label="Phone"
                name={FormElement.PhoneNumber}
                type="phone"
                inputMode="tel"
                required
                defaultValue={prefilledData.phoneNumber ?? undefined}
              />
            </Section>

            <Space y={1}>
              <Text size="m">
                After completing the purchase, you&apos;ll be able to connect payment.
              </Text>
              <SubmitButton loading={loading} signingStatus={props.signingStatus} />
              {userError && <Text size="m">{userError.message}</Text>}
            </Space>
          </Space>
        </Main>
      </Space>
    </>
  )
}

const SubmitButton = ({
  loading,
  signingStatus,
}: Pick<CheckoutPageProps, 'loading' | 'signingStatus'>) => {
  let label
  if (loading) {
    label = 'Processing...'
  } else {
    label = 'Sign with BankID'
  }
  return (
    <>
      <Button fullWidth disabled={loading}>
        {label}
      </Button>
      {signingStatus === CheckoutSigningStatus.Pending && (
        <Text size="m" align="center">
          Please open your BankID app
        </Text>
      )}
    </>
  )
}

const Header = styled.header(({ theme }) => ({
  height: '3.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space[4],
  position: 'relative',
}))

const StyledLink = styled.a(({ theme }) => ({
  position: 'absolute',
  left: theme.space[4],
  top: '50%',
  transform: 'translate(0, -50%)',
}))

const ArrowBackIcon = styled(ArrowForwardIcon)({
  transform: 'rotate(180deg)',
})

const Main = styled.main(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[4],
}))

const MainTop = styled.div({ textAlign: 'center' })

const Section = styled(Space)(({ theme }) => ({
  borderTop: `2px solid ${theme.colors.gray900}`,
  paddingTop: theme.space[4],
}))

export default CheckoutPage
