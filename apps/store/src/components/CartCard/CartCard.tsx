import styled from '@emotion/styled'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

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

const RemoveButton = styled.button({
  marginTop: '2rem',
  textDecoration: 'underline',
  fontSize: '0.925rem',
  cursor: 'pointer',
})

export type CartCardProps = {
  title: string
  price: number
  currency: string
}

export const CartCard = ({ title, price, currency }: CartCardProps) => {
  const currencyFormatter = useCurrencyFormatter(currency)

  const handleRemoveProduct = () => {
    //open toast to ask for confirmation.
  }
  return (
    <ProductCard>
      <Content>
        <IconElement />
        <HeaderElement>
          <TitleElement>{title}</TitleElement>
          <RemoveButton onClick={() => handleRemoveProduct()}>Remove</RemoveButton>
        </HeaderElement>
        <ExtraElement>{currencyFormatter.format(price)}/mo.</ExtraElement>
      </Content>
    </ProductCard>
  )
}
