import styled from '@emotion/styled'
import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { Button, ChevronIcon, Heading, LinkButton, Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { PageLink } from '@/lib/PageLink'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'

export const CheckoutPaymentPage = () => {
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
                  <Space y={0.5}>
                    <DataRow>
                      <Text size="m">Subtotal</Text>
                      <Text size="m">299 kr</Text>
                    </DataRow>
                    <CollapsibleDivider />
                  </Space>
                </CollapsibleContent>
                <CollapsibleHeader>
                  <Text size="l">Total</Text>
                  <SpaceFlex space={0.5}>
                    <Text size="l">299 kr/mo.</Text>
                    <RadixCollapsible.Trigger>
                      <TriggerIcon size="1rem" />
                    </RadixCollapsible.Trigger>
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

const DataRow = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

const CollapsibleHeader = styled(DataRow)(({ theme }) => ({
  paddingRight: theme.space[1],
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
