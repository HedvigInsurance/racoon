import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import * as CartNotification from '@/components/CartNotification/CartNotification'
import { Header } from '@/components/CartNotification/CartNotification'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { Main } from '../CartNotification/Main'

const ProductCard = styled.div(({ theme }) => ({
  paddingRight: theme.space[3],
  paddingLeft: theme.space[3],
  paddingBottom: theme.space[4],
}))

const Content = styled.div({
  display: 'grid',
  gridTemplateColumns: '4rem 2fr 1fr',
})

const HeaderElement = styled.div({
  display: 'block',
  width: '100%',
  alignItems: 'center',
  fontSize: '1rem',
})

const TitleElement = styled.div({})
const IconElement = styled.div(
  {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
  },
  (props) => ({
    border: `2px solid ${props.theme.colors.gray500}`,
    backgroundColor: `${props.theme.colors.gray300}`,
  }),
)
const ExtraElement = styled.div({
  justifySelf: 'end',
})

const RemoveButton = styled.button(({ theme }) => ({
  marginTop: theme.space[6],
  textDecoration: 'underline',
  fontSize: '0.925rem',
  cursor: 'pointer',
}))

const ButtonContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: theme.space[4],
}))

export type CartCardProps = {
  title: string
  price: number
  currency: string
}

export const CartCard = ({ title, price, currency }: CartCardProps) => {
  const currencyFormatter = useCurrencyFormatter(currency)

  const handleRemove = () => {
    //send request to backend to remove product
  }

  return (
    <ProductCard>
      <Content>
        <IconElement />
        <HeaderElement>
          <TitleElement>{title}</TitleElement>
          <CartNotification.Root>
            <CartNotification.Trigger asChild>
              <RemoveButton>Remove</RemoveButton>
            </CartNotification.Trigger>
            <CartNotification.Content Title={<Header>Remove insurance ?</Header>}>
              <Main>
                <Space y={1}>
                  <ExtraElement>
                    You will lose the discount applied if you remove the insurance.
                  </ExtraElement>
                  <ButtonContainer>
                    <CartNotification.Close>
                      <Button variant="outlined">Dont remove</Button>
                    </CartNotification.Close>
                    <CartNotification.Close>
                      <Button onClick={() => handleRemove()}>Remove</Button>
                    </CartNotification.Close>
                  </ButtonContainer>
                </Space>
              </Main>
            </CartNotification.Content>
          </CartNotification.Root>
        </HeaderElement>
        <ExtraElement>{currencyFormatter.format(price)}/mo.</ExtraElement>
      </Content>
    </ProductCard>
  )
}
