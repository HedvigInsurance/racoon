import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, CrossIcon, Heading, Space } from 'ui'
import { CampaignCodeList } from '@/components/CartInventory/CampaignCodeList'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TextField } from '@/components/TextField/TextField'
import * as Auth from '@/services/Auth/Auth'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { BankIdIcon } from './BankIdIcon'
import { CartCollapsible } from './CartCollapsible/CartCollapsible'
import { FormElement } from './CheckoutPage.constants'
import { CheckoutPageProps } from './CheckoutPage.types'
import { useHandleSubmitCheckout } from './useHandleSubmitCheckout'

const CheckoutPage = (props: CheckoutPageProps) => {
  const { checkoutId, checkoutSigningId, cart, prefilledData } = props
  const { t } = useTranslation('checkout')

  const { shopSession } = useShopSession()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const [handleSubmitSign, { loading }] = useHandleSubmitCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess(accessToken) {
      Auth.save(accessToken)
      setupShopSessionServiceClientSide(apolloClient).reset()
      const shopSessionId = shopSession?.id
      if (!shopSessionId) {
        throw new Error('shopSessionId must exists at this point')
      }
      router.push(PageLink.checkoutPayment({ shopSessionId }))
    },
  })

  return (
    <Wrapper y={1}>
      <div>
        <Header>
          <Heading as="h1" variant="standard.24">
            {t('CHECKOUT_PAGE_HEADING')}
          </Heading>

          <Link href={PageLink.cart()}>
            <CrossIcon size="1.5rem" />
          </Link>
        </Header>
      </div>

      <Section>
        <CartCollapsible
          title={t('CART_INVENTORY_COLLAPSIBLE_TITLE', { count: cart.entries.length })}
          cost={cart.cost}
        >
          <CartCollapsibleInner>
            <CartEntryList>
              {cart.entries.map((item) => (
                <CartEntryItem key={item.offerId} cartId={cart.id} {...item} />
              ))}
            </CartEntryList>
            <HorizontalLine />
            <CampaignCodeList cartId={cart.id} campaigns={cart.campaigns} />
            <HorizontalLine />
            <CostSummary {...cart.cost} />
          </CartCollapsibleInner>
        </CartCollapsible>
      </Section>

      <HorizontalLineStandalone />

      <Section y={1}>
        <SpaceBetween>
          <SpaceFlex space={0.5} align="center">
            <StepIcon />
            <Text size="l">{t('CONTACT_DETAILS_FORM_TITLE')}</Text>
          </SpaceFlex>
          <Text size="l">{t('FORM_HELP_LABEL')}</Text>
        </SpaceBetween>

        <form onSubmit={handleSubmitSign}>
          <Space y={0.25}>
            <PersonalNumberField
              name={FormElement.PersonalNumber}
              label={t('FIELD_PERSONAL_NUMBER_SE_LABEL')}
              required
              defaultValue={prefilledData.personalNumber ?? undefined}
            />
            <TextField
              type="email"
              label={t('FORM_EMAIL_LABEL')}
              name={FormElement.Email}
              required
              defaultValue={prefilledData.email ?? undefined}
            />
            <Space y={0.5}>
              <Button fullWidth disabled={loading}>
                <SpaceFlex space={0.5}>
                  <BankIdIcon />
                  {t('SIGN_BUTTON', { count: cart.entries.length })}
                </SpaceFlex>
              </Button>
              <Text size="s" color="gray600" align="center">
                {t('SIGN_DISCLAIMER')}
              </Text>
            </Space>
          </Space>
        </form>
      </Section>

      <HorizontalLineStandalone />
    </Wrapper>
  )
}

const Wrapper = styled(Space)(({ theme }) => ({
  paddingBottom: theme.space[6],
}))

const Section = styled(Space)(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))

const Header = styled(Section)({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
Header.defaultProps = { as: 'header' }

const HorizontalLine = styled.hr(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  height: 1,
}))

const HorizontalLineStandalone = styled(HorizontalLine)(({ theme }) => ({
  marginLeft: theme.space[4],
  marginRight: theme.space[4],
}))

const StepIcon = styled.div(({ theme }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.gray900,
}))

const SpaceBetween = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[4],
}))

const CartCollapsibleInner = styled(Space)(({ theme }) => ({
  paddingTop: theme.space[4],
  paddingBottom: theme.space[4],
}))
CartCollapsibleInner.defaultProps = { y: 1.5 }

export default CheckoutPage
