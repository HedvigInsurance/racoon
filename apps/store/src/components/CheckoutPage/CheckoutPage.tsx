import { useApolloClient } from '@apollo/client'
import { css } from '@emotion/react'
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
    collectEmail,
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
      <Space y={{ base: 1, lg: 3 }}>
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
        <Layout>
          <Content y={{ base: 1, lg: 3 }}>
            <Heading as="h1" variant="standard.24" align="center">
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
                  <CampaignCodeList cartId={cart.id} campaigns={cart.campaigns} />
                  <HorizontalLine />
                  <CostSummary {...cart.cost} campaigns={cart.campaigns} />
                </CartCollapsibleInner>
              </CartCollapsible>

              <Space y={{ base: 1, lg: 2 }}>
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
                    {collectEmail && (
                      <TextField
                        type="email"
                        label={t('FORM_EMAIL_LABEL')}
                        name={FormElement.Email}
                        required
                      />
                    )}
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
            </div>
          </Content>
        </Layout>
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

const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  [mq.lg]: {
    paddingInline: theme.space.xl,
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

const Header = styled(Layout)({
  gridAutoRows: '3rem',
  alignItems: 'center',

  [mq.sm]: {
    gridAutoRows: '3.5rem',
  },
})

const HeaderLogo = styled.div({
  gridColumn: 'span 6',

  [mq.sm]: {
    gridColumn: 1,
  },
})
const HeaderBreadcrumbs = styled.div(gridCenterStyles, {
  gridRow: 2,
  gridColumn: '1 / -1',

  [mq.sm]: {
    gridRow: 1,
  },
})
const HeaderBack = styled.div({
  gridColumn: 'span 6',
  justifySelf: 'flex-end',

  [mq.sm]: {
    gridColumn: -1,
  },
})

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
