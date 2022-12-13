import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Button, Heading, LinkButton, Separate, Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { I18nNamespace } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CampaignCodeList } from './CampaignCodeList'
import { CartEntryItem } from './CartEntryItem'
import { CartPageProps } from './CartPageProps.types'
import { CostSummary } from './CostSummary'
import { useStartCheckout } from './useStartCheckout'

export const CartPage = (props: CartPageProps) => {
  const { shopSessionId, cartId, entries, campaigns, cost } = props
  const { t } = useTranslation(I18nNamespace.Cart)

  const router = useRouter()
  const [startCheckout, { loading: loadingStartCheckout }] = useStartCheckout({
    shopSessionId,
    onCompleted() {
      router.push(PageLink.checkout())
    },
  })

  if (entries.length === 0) {
    return (
      <EmptyState>
        <Space y={1.5}>
          <HorizontalLine />
          <CampaignCodeList cartId={cartId} campaigns={campaigns} />
          <HorizontalLine />
          <CostSummary cost={cost} />
        </Space>
      </EmptyState>
    )
  }

  return (
    <Wrapper>
      <Space y={1.5}>
        <Header />

        <CartEntryList Separator={<HorizontalLineWithSpace />}>
          {entries.map((item) => (
            <CartEntryItem key={item.offerId} cartId={cartId} {...item} />
          ))}
        </CartEntryList>

        <HorizontalLine />

        <CampaignCodeList cartId={cartId} campaigns={campaigns} />

        <HorizontalLine />

        <CostSummary cost={cost} />

        <Button fullWidth onClick={startCheckout} disabled={loadingStartCheckout}>
          {t('CHECKOUT_BUTTON')}
        </Button>
      </Space>
    </Wrapper>
  )
}

type EmptyStateProps = { children: ReactNode }

const EmptyState = ({ children }: EmptyStateProps) => {
  const { t } = useTranslation(I18nNamespace.Cart)
  const { routingLocale } = useCurrentLocale()

  return (
    <Wrapper>
      <Space y={5}>
        <Header />

        <Space y={2}>
          <Space y={1}>
            <CenteredText>¯\_(ツ)_/¯</CenteredText>
            <CenteredText>{t('CART_EMPTY_SUMMARY')}</CenteredText>
          </Space>

          <LinkButton as={Link} fullWidth href={PageLink.store({ locale: routingLocale })}>
            {t('GO_TO_STORE_BUTTON')}
          </LinkButton>
        </Space>

        {children}
      </Space>
    </Wrapper>
  )
}

const Header = () => {
  const { t } = useTranslation(I18nNamespace.Cart)

  return (
    <StyledHeader>
      <Heading as="h1" variant="standard.24">
        {t('CART_PAGE_HEADING')}
      </Heading>
    </StyledHeader>
  )
}

const StyledHeader = styled.div({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Wrapper = styled.div(({ theme }) => ({
  width: '100%',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[7],
}))

const CenteredText = styled(Text)({ textAlign: 'center' })

const HorizontalLine = styled.hr(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  height: 1,
}))

const HorizontalLineWithSpace = styled(HorizontalLine)(({ theme }) => ({
  marginTop: theme.space[5],
  marginBottom: theme.space[5],
}))

const CartEntryList = styled(Separate)({
  padding: 0,
  listStyleType: 'none',
  width: '100%',
})
CartEntryList.defaultProps = { as: 'ul' }
