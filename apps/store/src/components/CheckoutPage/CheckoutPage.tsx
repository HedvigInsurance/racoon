import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useState } from 'react'
import { Button, Heading, HedvigLogo, mq, Space, Text, theme } from 'ui'
import { CampaignCodeList } from '@/components/CartInventory/CampaignCodeList'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import { ShopSessionSigningStatus } from '@/services/apollo/generated'
import { saveAccessToken } from '@/services/authApi/persist'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { PageLink } from '@/utils/PageLink'
import { BankIdIcon } from './BankIdIcon'
import { Breadcrumbs } from './Breadcrumbs'
import { CartCollapsible } from './CartCollapsible/CartCollapsible'
import { FormElement } from './CheckoutPage.constants'
import { CheckoutPageProps } from './CheckoutPage.types'
import { TickIcon } from './TickIcon'
import { useHandleSubmitCheckout } from './useHandleSubmitCheckout'

const CheckoutPage = (props: CheckoutPageProps) => {
  const {
    cart,
    ssn,
    prefilledData,
    collectName,
    customerAuthenticationStatus,
    shopSessionId,
    shopSessionSigningId,
  } = props
  const { t } = useTranslation('checkout')

  const [showSignError, setShowSignError] = useState(false)
  const { shopSession } = useShopSession()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const tracking = useTracking()
  const [hideLoading, setHideLoading] = useState(false)
  const [handleSubmitSign, { loading, userError, signingStatus }] = useHandleSubmitCheckout({
    shopSessionId,
    customerAuthenticationStatus,
    shopSessionSigningId,
    onSuccess(accessToken) {
      saveAccessToken(accessToken)
      const shopSessionId = shopSession?.id
      if (!shopSessionId) {
        throw new Error('shopSessionId must exists at this point')
      }
      tracking.reportPurchase(shopSession.cart)
      setupShopSessionServiceClientSide(apolloClient).reset()
      router.push(PageLink.checkoutPayment({ shopSessionId }))
    },
    onError() {
      setShowSignError(true)
      setHideLoading(false)
    },
  })

  const signFailed = signingStatus === ShopSessionSigningStatus.Failed
  const signFailedMessage = signFailed ? t('UNKNOWN_ERROR_MESSAGE', { ns: 'common' }) : undefined
  const userErrorMessage = userError?.message ?? signFailedMessage

  const isSigned = signingStatus === ShopSessionSigningStatus.Signed
  const showLoading = (loading || isSigned) && !hideLoading

  return (
    <>
      <Space y={{ base: 1, lg: 2.5 }}>
        <Header>
          <HeaderLogo>
            <HedvigLogo width={78} />
          </HeaderLogo>
          <HeaderBreadcrumbs>
            <Breadcrumbs />
          </HeaderBreadcrumbs>
          <HeaderBack>
            <HeaderLink href={PageLink.cart()}>{t('BACK_BUTTON')}</HeaderLink>
          </HeaderBack>
        </Header>
        <Wrapper y={{ base: 2, lg: 3.5 }}>
          <Heading as="h1" variant="standard.24" align="center">
            {t('CHECKOUT_PAGE_HEADING')}
          </Heading>

          <Space y={{ base: 1, lg: 1.5 }}>
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
                <CampaignCodeList cartId={cart.id} campaigns={cart.campaigns} />
                <HorizontalLine />
                <CostSummary {...cart.cost} campaigns={cart.campaigns} />
              </CartCollapsibleInner>
            </CartCollapsible>

            <HorizontalLine />

            <form onSubmit={handleSubmitSign}>
              <Space y={0.25}>
                <PersonalNumberField
                  label={t('FIELD_PERSONAL_NUMBER_SE_LABEL')}
                  value={ssn}
                  readOnly
                  disabled
                />
                {collectName && (
                  <SpaceFlex space={0.25}>
                    <TextField
                      type="text"
                      label={t('FORM_FIRST_NAME_LABEL')}
                      name={FormElement.FirstName}
                      defaultValue={prefilledData.firstName}
                      required
                    />
                    <TextField
                      type="text"
                      label={t('FORM_LAST_NAME_LABEL')}
                      name={FormElement.LastName}
                      defaultValue={prefilledData.lastName}
                      required
                    />
                  </SpaceFlex>
                )}
                <TextField
                  type="email"
                  label={t('FORM_EMAIL_LABEL')}
                  name={FormElement.Email}
                  defaultValue={prefilledData.email}
                  required
                />
                <Space y={0.5}>
                  <SignButton loading={loading}>
                    {t('SIGN_BUTTON', { count: cart.entries.length })}
                  </SignButton>
                  <Text size="sm" color="textSecondary" align="center">
                    {userErrorMessage ?? t('SIGN_DISCLAIMER')}
                  </Text>
                </Space>
              </Space>
            </form>
          </Space>
        </Wrapper>
      </Space>

      <FullscreenDialog.Root open={showLoading} onOpenChange={(open) => setHideLoading(!open)}>
        <FullscreenDialog.Modal center Footer={null}>
          <SpaceFlex direction="vertical" align="center" space={1.5}>
            {isSigned ? (
              <>
                <TickIcon size="3rem" />
                <Text align="center">{t('BANKID_MODAL_SUCCESS_PROMPT')}</Text>
              </>
            ) : (
              <>
                <BankIdIcon size="3rem" color="gray1000" />
                <div>
                  <Text align="center">{t('BANKID_MODAL_PROMPT')}</Text>
                  <Text align="center" color="textSecondary">
                    {t('BANKID_MODAL_DESCRIPTION')}
                  </Text>
                </div>
                <FullscreenDialog.Close asChild>
                  <Button size="small" variant="secondary">
                    {t('BANKID_MODAL_CANCEL')}
                  </Button>
                </FullscreenDialog.Close>
              </>
            )}
          </SpaceFlex>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>

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

const Wrapper = styled(Space)({
  paddingBottom: theme.space.xl,
  paddingInline: theme.space.md,

  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})

const Header = styled.header({
  paddingInline: theme.space.md,

  display: 'grid',
  gridTemplateAreas: `
    'logo back'
    'breadcrumbs breadcrumbs'
  `,
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: '3rem 3rem',
  alignItems: 'center',

  [mq.md]: {
    gridTemplateAreas: `
      'logo breadcrumbs back'
    `,
    gridTemplateColumns: '1fr minmax(28rem, 33%) 1fr',
    gridTemplateRows: '3.5rem',
  },
})

const HeaderLogo = styled.div({ gridArea: 'logo' })
const HeaderBreadcrumbs = styled.div({ gridArea: 'breadcrumbs' })
const HeaderBack = styled.div({ gridArea: 'back', justifySelf: 'flex-end' })

const HeaderLink = styled(Link)({
  backgroundColor: theme.colors.light,
  fontSize: theme.fontSizes.md,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },

  [mq.lg]: {
    position: 'absolute',
    top: theme.space.md,
    right: theme.space.md,
  },
})

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})

const CartCollapsibleInner = styled(Space)({
  paddingTop: theme.space.md,
})

const SignButton = ({ children, loading }: PropsWithChildren<{ loading: boolean }>) => {
  return (
    <Button type="submit" loading={loading} disabled={loading}>
      <StyledSignButtonContent>
        <BankIdIcon color="white" />
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
