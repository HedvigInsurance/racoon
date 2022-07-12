import { css } from '@emotion/react'
import styled from '@emotion/styled'
import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { useMemo } from 'react'
import { ChevronIcon, Heading, LinkButton, Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { PageLink } from '@/lib/PageLink'
import { CheckoutPaymentPageProps } from './CheckoutPaymentPage.types'

export const CheckoutPaymentPage = ({
  currency,
  cost,
  products,
  campaigns,
}: CheckoutPaymentPageProps) => {
  const { currencyLocale } = useCurrentLocale()
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [currencyLocale, currency])

  return (
    <div>
      <Space y={3}>
        <Header>
          <a href={PageLink.checkout()}>Return to contact details</a>
        </Header>

        <PageHeader>
          <Heading headingLevel="h1" colorVariant="dark" variant="m">
            Payment
          </Heading>
        </PageHeader>

        <Main>
          <Space y={2}>
            <Space y={0.5}>
              <Collapsible>
                <CollapsibleContent>
                  <Space y={1.5}>
                    <Space y={0.5}>
                      <DataRow>
                        <Text size="m">Subtotal</Text>
                        <Text size="m">{currencyFormatter.format(cost.subTotal)}</Text>
                      </DataRow>
                      {products.map((product) => (
                        <DataRow key={product.name}>
                          <Text size="m">{product.name}</Text>
                          <Text size="m">{currencyFormatter.format(product.cost)}</Text>
                        </DataRow>
                      ))}
                    </Space>
                    {campaigns ? (
                      <Space y={0.5}>
                        <Text size="m">Discount</Text>
                        {campaigns.map((campaign) => (
                          <DataRow key={campaign.name}>
                            <Text size="m">{campaign.name}</Text>
                            <Text size="m">{currencyFormatter.format(campaign.discount)}</Text>
                          </DataRow>
                        ))}
                      </Space>
                    ) : null}
                    <CollapsibleDivider />
                  </Space>
                </CollapsibleContent>
                <CollapsibleHeader>
                  <Text size="l">Total</Text>
                  <SpaceFlex x={0.25}>
                    {cost.crossOut ? (
                      <CrossOutText>
                        <Text size="l">{currencyFormatter.format(cost.crossOut)}</Text>
                      </CrossOutText>
                    ) : null}

                    <SpaceFlex x={0.5}>
                      <Text size="l">{currencyFormatter.format(cost.total)}/mo.</Text>
                      <TriggerIcon size="1rem" />
                    </SpaceFlex>
                  </SpaceFlex>
                </CollapsibleHeader>
              </Collapsible>
              <p>
                <Text size="s">
                  Money is withdrawn the end of each month. We handle payments securely with X.
                </Text>
              </p>
            </Space>

            <Space y={0.5}>
              <LinkButton href={PageLink.confirmation()} fullWidth>
                Complete purchase
              </LinkButton>
              <p>
                <Text size="s">
                  By clicking &quot;Complete purchase&quot; I confirm that I have read and
                  understood the terms and conditions, and that I approve that Hedvig handles my
                  personal information.
                </Text>
              </p>
            </Space>
          </Space>
        </Main>
      </Space>
    </div>
  )
}

const Header = styled.header(({ theme }) => ({
  padding: theme.space[3],
}))

const PageHeader = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))

const Main = styled.main(({ theme }) => ({
  padding: theme.space[3],
}))

const Collapsible = styled(RadixCollapsible.Root)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  padding: theme.space[3],
}))

const DataRowStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const DataRow = styled.div(({ theme }) => ({}), DataRowStyles)

const CollapsibleHeader = styled(RadixCollapsible.Trigger)(
  ({ theme }) => ({
    paddingRight: theme.space[1],
    width: '100%',
  }),
  DataRowStyles,
)

const CrossOutText = styled.p(({ theme }) => ({
  color: theme.colors.gray500,
  textDecoration: 'line-through',
}))

const SpaceFlex = styled(Space)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}))

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

const CollapsibleContent = styled(RadixCollapsible.Content)(({ theme }) => ({}))

const CollapsibleDivider = styled.div(({ theme }) => ({
  borderTop: `1px solid ${theme.colors.gray300}`,
  height: theme.space[2],
}))
