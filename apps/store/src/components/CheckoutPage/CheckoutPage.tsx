import { useApolloClient } from '@apollo/client'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useState } from 'react'
import { BankIdIcon, Button, Heading, mq, Space, Text, theme } from 'ui'
import { CampaignsSection } from '@/components/CartInventory/CampaignsSection'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CartEntryOfferItem } from '@/components/CartInventory/CartEntryOfferItem'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { getCheckoutStepLink } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import {
  CartFragmentFragment,
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
  ShopSessionAuthenticationStatus,
} from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CheckoutHeader } from '../CheckoutHeader/CheckoutHeader'
import { FormElement, QueryParam } from './CheckoutPage.constants'
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

  const { routingLocale } = useCurrentLocale()
  const [showSignError, setShowSignError] = useState(false)
  const { shopSession, reset: resetShopSession } = useShopSession()
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

      tracking.reportPurchase(
        shopSession.cart,
        memberId,
        customerAuthenticationStatus === ShopSessionAuthenticationStatus.None,
      )
      resetShopSession()

      const checkoutStepIndex = checkoutSteps.findIndex((item) => item === CheckoutStep.Checkout)
      const nextCheckoutStep = checkoutSteps[checkoutStepIndex + 1]
      await router.push(getCheckoutStepLink({ step: nextCheckoutStep, shopSessionId }))
    },
    // TODO: Never used inside, remove and refactor
    onError() {
      setShowSignError(true)
    },
  })

  const handleRemoveCartEntry = (cart: CartFragmentFragment) => {
    if (cart.entries.length === 0) {
      router.push(PageLink.cart())
    }
  }

  const { productRecommendationOffers } = useProductRecommendations()

  const userErrorMessage = userError?.message

  return (
    <>
      <Space y={{ base: 2.5 }}>
        <CheckoutHeader steps={checkoutSteps} activeStep={CheckoutStep.Checkout}>
          <TextLink href={PageLink.cart()}>{t('BACK_BUTTON')}</TextLink>
        </CheckoutHeader>
        <Layout>
          <Content y={{ base: 2.5, md: 3.5 }}>
            <Headings>
              <Heading as="h1" variant="standard.24" align="center">
                {t('CHECKOUT_PAGE_HEADING')}
              </Heading>
              <Heading as="h2" balance color="textSecondary" variant="standard.24" align="center">
                {t('CHECKOUT_PAGE_SUBHEADING')}
              </Heading>
            </Headings>

            <Space y={1}>
              <Space y={{ base: 1, lg: 1.5 }}>
                <CartEntryList>
                  {cart.entries.map((item) => (
                    <CartEntryItem
                      key={item.offerId}
                      shopSessionId={shopSessionId}
                      onRemove={handleRemoveCartEntry}
                      defaultOpen={router.query[QueryParam.ExpandCart] === '1'}
                      {...item}
                    />
                  ))}
                </CartEntryList>
                {cart.campaigns.enabled && (
                  <>
                    <CampaignsSection
                      shopSessionId={shopSessionId}
                      campaigns={cart.campaigns.list}
                    />
                    <HorizontalLine />
                  </>
                )}
                <CostSummary {...cart.cost} campaigns={cart.campaigns.list} />
                <div />
              </Space>

              <Space y={2}>
                {productRecommendationOffers && productRecommendationOffers.length > 0 && (
                  <CartEntryList>
                    {productRecommendationOffers.map(({ product, offer }) => {
                      if (!offer) return null
                      return (
                        <CartEntryOfferItem
                          key={offer.id}
                          shopSessionId={shopSessionId}
                          product={product}
                          offer={offer}
                        />
                      )
                    })}
                  </CartEntryList>
                )}
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
                      {userErrorMessage ? (
                        <Text as="p" size="xs" color="textSecondary" align="center">
                          {userErrorMessage}
                        </Text>
                      ) : (
                        <TextWithLink
                          as="p"
                          size="xs"
                          align="center"
                          balance={true}
                          href={PageLink.privacyPolicy({ locale: routingLocale })}
                          target="_blank"
                        >
                          {t('SIGN_DISCLAIMER')}
                        </TextWithLink>
                      )}
                    </Space>
                  </Space>
                </form>
              </Space>
            </Space>
          </Content>
        </Layout>
      </Space>

      <FullscreenDialog.Root open={showSignError} onOpenChange={setShowSignError}>
        <FullscreenDialog.Modal
          center={true}
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
  paddingBottom: theme.space[10],
  columnGap: theme.space.md,
})

const Headings = styled.div({ maxWidth: '35ch', marginInline: 'auto' })

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
