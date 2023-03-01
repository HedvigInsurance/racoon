import styled from '@emotion/styled'
import { Text, theme } from 'ui'

export type ShoppingBagIconProps = {
  count: number
}

export const ShoppingBagIcon = ({ count }: ShoppingBagIconProps) => {
  const hasItemsInCart = count > 0

  return (
    <>
      {hasItemsInCart ? (
        <Wrapper>
          <ShoppingBagIconDark />
          <Count as="span" color="textNegative" size="xs">
            {count}
          </Count>
        </Wrapper>
      ) : (
        <Wrapper>
          <ShoppingBagIconLight />
          <Count size="xs">{count}</Count>
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Count = styled(Text)({
  position: 'absolute',
  // Center vertically
  marginTop: -1,
})

const ShoppingBagIconLight = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.9851 0.75C16.0249 0.75 18.7908 1.58865 20.5594 3.31458C22.3242 5.03683 23.25 7.79409 23.25 12C23.25 16.2059 22.3242 18.9632 20.5594 20.6854C18.7908 22.4114 16.0249 23.25 11.9851 23.25C7.93771 23.25 5.18225 22.4458 3.42411 20.7405C1.67072 19.0397 0.75 16.2866 0.75 12C0.75 7.7134 1.67072 4.96031 3.42411 3.25954C5.18225 1.55416 7.93771 0.75 11.9851 0.75Z"
        stroke={theme.colors.textPrimary}
        strokeWidth="1.5"
      />
    </svg>
  )
}

const ShoppingBagIconDark = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 12C24 3.40752 20.2268 0 11.9851 0C3.7434 0 5.42085e-08 3.25652 1.99754e-07 12C3.45299e-07 20.7435 3.7434 24 11.9851 24C20.2268 24 24 20.5925 24 12Z"
        fill={theme.colors.textPrimary}
      />
    </svg>
  )
}
