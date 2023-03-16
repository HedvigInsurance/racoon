import { useApolloClient } from '@apollo/client'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useState } from 'react'
import { BankIdIcon, Button, Heading, mq, Space, Text, theme } from 'ui'
import { CampaignsSection } from '@/components/CartInventory/CampaignsSection'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { CheckoutHeader } from '@/components/CheckoutHeader/CheckoutHeader'
import { getCheckoutStepLink } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import {
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
  ShopSessionAuthenticationStatus,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { PageLink } from '@/utils/PageLink'
import { CartCollapsible } from './CartCollapsible/CartCollapsible'
import { FormElement } from './CheckoutPage.constants'
import { CheckoutPageProps } from './CheckoutPage.types'
import { useHandleSubmitCheckout } from './useHandleSubmitCheckout'

const CheckoutPage = (props: CheckoutPageProps) => {
  const {
    cart,
    ssn,
    shouldCollectEmail,
    suggestedEmail,
    shouldCollectName,
    customerAuthenticationStatus,
    shopSessionId,
    checkoutSteps,
  } = props
  const { t } = useTranslation('checkout')

  const [showSignError, setShowSignError] = useState(false)
  const { shopSession } = useShopSession()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const tracking = useTracking()
  const [handleSubmitSign, { loading, userError }] = useHandleSubmitCheckout({
    shopSessionId,
    ssn,
    customerAuthenticationStatus,
    async onSuccess() {
      const shopSessionId = shopSession?.id
      if (!shopSessionId) {
        throw new Error('shopSessionId must exists at this point')
      }

      const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
        query: CurrentMemberDocument,
      })
      const memberId = data.currentMember.id

      tracking.reportPurchase(shopSession.cart, memberId)
      setupShopSessionServiceClientSide(apolloClient).reset()

      const checkoutStepIndex = checkoutSteps.findIndex((item) => item === CheckoutStep.Checkout)
      const nextCheckoutStep = checkoutSteps[checkoutStepIndex + 1]
      await router.push(getCheckoutStepLink({ step: nextCheckoutStep, shopSession }))
    },
    onError() {
      setShowSignError(true)
    },
  })

  const userErrorMessage = userError?.message

  return (
    <>
      <Space y={{ base: 2.5 }}>
        <CheckoutHeader steps={checkoutSteps} activeStep={CheckoutStep.Checkout}>
          <TextLink href={PageLink.cart()}>{t('BACK_BUTTON')}</TextLink>
        </CheckoutHeader>
        <Layout>
          <Content y={{ base: 2.5 }}>
            <Heading balance as="h1" variant="standard.24" align="center">
              {t('CHECKOUT_PAGE_HEADING')}
            </Heading>

            <div>
              <CartCollapsible
                title={t('CART_INVENTORY_COLLAPSIBLE_TITLE', { count: cart.entries.length })}
                cost={cart.cost}
              >
                <CartCollapsibleInner y={{ base: 1, lg: 1.5 }}>
                  <CartEntryList>
                    {cart.entries.map((item) => (
                      <CartEntryItem readOnly key={item.offerId} cartId={cart.id} {...item} />
                    ))}
                  </CartEntryList>
                  <HorizontalLine />
                  <CampaignsSection cartId={cart.id} campaigns={cart.campaigns} />
                  <HorizontalLine />
                  <CostSummary {...cart.cost} campaigns={cart.campaigns} />
                  <div />
                </CartCollapsibleInner>
              </CartCollapsible>

              <Space y={{ base: 1, lg: 1.5 }}>
                <HorizontalLine />
                <form onSubmit={handleSubmitSign}>
                  <Space y={0.25}>
                    <PersonalNumberField
                      label={t('FIELD_PERSONAL_NUMBER_SE_LABEL')}
                      value={ssn}
                      readOnly
                      disabled
                    />
                    {shouldCollectName && (
                      <SpaceFlex space={0.25}>
                        <TextField
                          type="text"
                          label={t('FORM_FIRST_NAME_LABEL')}
                          name={FormElement.FirstName}
                          required
                        />
                        <TextField
                          type="text"
                          label={t('FORM_LAST_NAME_LABEL')}
                          name={FormElement.LastName}
                          required
                        />
                      </SpaceFlex>
                    )}
                    {shouldCollectEmail && (
                      <TextField
                        type="email"
                        label={t('FORM_EMAIL_LABEL')}
                        name={FormElement.Email}
                        defaultValue={suggestedEmail}
                        required
                      />
                    )}
                    <Space y={0.5}>
                      <SignButton
                        loading={loading}
                        showBankIdIcon={
                          customerAuthenticationStatus !==
                          ShopSessionAuthenticationStatus.Authenticated
                        }
                      >
                        {t('SIGN_BUTTON', { count: cart.entries.length })}
                      </SignButton>
                      <Text size="xs" color="textSecondary" align="center">
                        {userErrorMessage ?? t('SIGN_DISCLAIMER')}
                      </Text>
                    </Space>
                  </Space>
                </form>
              </Space>
            </div>
          </Content>
        </Layout>
      </Space>

      <FullscreenDialog.Root open={showSignError} onOpenChange={setShowSignError}>
        <FullscreenDialog.Modal
          center
          Footer={
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="primary">
                {t('ERROR_GENERAL_DIALOG_ACTION_TRY_AGAIN')}
              </Button>
            </FullscreenDialog.Close>
          }
        >
          <ErrorPrompt size={{ _: 'md', lg: 'lg' }} align="center">
            {t('ERROR_GENERAL_DIALOG_PROMPT')}
          </ErrorPrompt>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </>
  )
}

const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  [mq.lg]: {
    paddingInline: theme.space.lg,
  },
})

const gridCenterStyles = css({
  [mq.sm]: {
    gridColumn: '3 / span 8',
  },

  [mq.lg]: {
    gridColumn: '4 / span 6',
  },

  [mq.xl]: {
    gridColumn: '5 / span 4',
  },
})

const Content = styled(Space)(gridCenterStyles, {
  gridColumn: '1 / -1',
  paddingBottom: theme.space.xl,
  columnGap: theme.space.md,
})

const TextLink = styled(Link)({
  backgroundColor: theme.colors.light,
  fontSize: theme.fontSizes.md,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})

const CartCollapsibleInner = styled(Space)({
  paddingTop: theme.space.md,
})

type SignButtonProps = PropsWithChildren<{ loading: boolean; showBankIdIcon: boolean }>
const SignButton = ({ children, loading, showBankIdIcon }: SignButtonProps) => {
  return (
    <Button type="submit" loading={loading}>
      <StyledSignButtonContent>
        {showBankIdIcon && <BankIdIcon color="white" />}
        {children}
      </StyledSignButtonContent>
    </Button>
  )
}

const StyledSignButtonContent = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.sm,
  width: '100%',
})

const ErrorPrompt = styled(Text)({
  maxWidth: '42rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

export default CheckoutPage
