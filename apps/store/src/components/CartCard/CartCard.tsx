import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'

const ProductCard = styled.div(({theme}) => ({
  paddingRight: theme.space[4],
  paddingLeft: theme.space[4],
  paddingBottom: theme.space[5]
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
})

export type CartCardProps = {
  title: string
  price?: string
}

export const CartCard = ({ title, price }: CartCardProps) => {
  return (
    <ProductCard>
      <Content>
        <IconElement />
        <HeaderElement>
          {title && <TitleElement>{title}</TitleElement>}
          <RemoveButton>Remove</RemoveButton>
        </HeaderElement>
        {price && <ExtraElement>{price}</ExtraElement>}
      </Content>
    </ProductCard>
  )
}
