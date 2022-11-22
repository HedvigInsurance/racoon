import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Space } from 'ui'
import { AppStoreBadge } from '@/components/AppStoreBadge/AppStoreBadge'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import * as InventoryItem from '@/components/CartInventory/InventoryItem'
import { Pillow } from '@/components/Pillow/Pillow'
import { Text } from '@/components/Text/Text'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { fromNow } from './ConfirmationPage.helpers'
import { ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = (props: ConfirmationPageProps) => {
  const { cart, currency, platform } = props
  const { locale } = useCurrentLocale()
  const { t } = useTranslation()
  const currencyFormatter = useCurrencyFormatter(currency)

  return (
    <Wrapper>
      <Space y={4}>
        <header>
          <Space y={2.5}>
            <Space y={1}>
              <CenteredHeading as="h1" variant="standard.24">
                Welcome to Hedvig!
              </CenteredHeading>
            </Space>

            <CenteredList>
              {platform ? (
                <AppStoreBadge type={platform} locale={locale} />
              ) : (
                <>
                  <AppStoreBadge type="apple" locale={locale} />
                  <AppStoreBadge type="google" locale={locale} />
                </>
              )}
            </CenteredList>
          </Space>
        </header>

        <main>
          <Space y={1}>
            <Heading as="h2" variant="standard.18">
              Your purchase
            </Heading>

            <CartInventory cart={cart}>
              {(offer) => (
                <InventoryItem.Root>
                  <InventoryItem.Left>
                    <Pillow size="small" fromColor="#C0E4F3" toColor="#99AAD8" />
                  </InventoryItem.Left>
                  <InventoryItem.Main>
                    <InventoryItem.MainLeft>
                      <p>{offer.variant.displayName}</p>
                    </InventoryItem.MainLeft>
                    <InventoryItem.MainRight>
                      {t('MONTHLY_PRICE', {
                        displayAmount: currencyFormatter.format(offer.price.amount),
                      })}
                    </InventoryItem.MainRight>
                    <InventoryItem.MainBottom>
                      <Text as="p" color="gray600" size="s">
                        Activates {fromNow(new Date(offer.startDate), locale)}
                      </Text>
                    </InventoryItem.MainBottom>
                  </InventoryItem.Main>
                </InventoryItem.Root>
              )}
            </CartInventory>
          </Space>
        </main>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  padding: theme.space[4],
  paddingTop: theme.space[8],
  minHeight: '100vh',
  width: '100%',
}))

const CenteredHeading = styled(Heading)({
  textAlign: 'center',
})

const CenteredList = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space[2],
}))
