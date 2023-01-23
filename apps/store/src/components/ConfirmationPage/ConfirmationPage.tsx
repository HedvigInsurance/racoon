import styled from '@emotion/styled'
import { Heading, mq, Space, Text, theme } from 'ui'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = (props: ConfirmationPageProps) => {
  const { cart } = props
  return (
    <Wrapper>
      <Space y={4}>
        <header>
          <Heading as="h1" variant="standard.24">
            Ditt köp är klart!
          </Heading>
          <Text as="p" color="textSecondary" size="xl">
            En bekräftelse har skickats via mail.
          </Text>
        </header>
        <main>
          <Space y={1}>
            <CartInventory cart={cart} readOnly />
          </Space>
        </main>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingInline: theme.space.md,

  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})
