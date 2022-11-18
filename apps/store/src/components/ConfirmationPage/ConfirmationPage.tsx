import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Space } from 'ui'
import * as Table from '@/components/Table/Table'
import { Text } from '@/components/Text/Text'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { AppStoreBadge } from '../AppStoreBadge/AppStoreBadge'
import { fromNow } from './ConfirmationPage.helpers'
import { ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = ({
  firstName,
  currency,
  cost,
  products,
  platform,
}: ConfirmationPageProps) => {
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
                Welcome, {firstName}
              </CenteredHeading>
              <CenteredText>
                Thank you for joining Hedvig. You can access all information and help you need in
                the Hedvig app.
              </CenteredText>
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
              Purchase summary
            </Heading>

            <Space y={1}>
              <StyledTable layout="fixed">
                <Table.Body>
                  {products.map((product) => (
                    <Table.Row key={product.name}>
                      <Table.Cell>
                        <Text size="m">{product.name}</Text>
                      </Table.Cell>
                      <Table.Cell align="right">
                        <Text size="m">{fromNow(new Date(product.startDate), locale)}</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </StyledTable>

              <StyledTable layout="fixed">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Text size="m">Total price</Text>
                    </Table.Cell>
                    <Table.Cell align="right">
                      <Text size="m">
                        {t('MONTHLY_PRICE', {
                          displayAmount: currencyFormatter.format(cost.total),
                        })}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </StyledTable>
            </Space>
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
}))

const CenteredHeading = styled(Heading)({
  textAlign: 'center',
})

const CenteredText = styled.p(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.gray700,
}))

const CenteredList = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space[2],
}))

const StyledTable = styled(Table.Root)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))
