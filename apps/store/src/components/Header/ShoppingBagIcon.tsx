import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Text } from 'ui'

export type ShoppingBagIconProps = {
  count: number
}

export const ShoppingBagIcon = ({ count }: ShoppingBagIconProps) => {
  const hasItemsInCart = count > 0
  console.log('hasItemsInCart', hasItemsInCart)

  return (
    <>
      {hasItemsInCart ? (
        <Wrapper>
          <ShoppingBagIconDark />
          <Count color="textNegative" size="xs">
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

const Count = styled(Text)({ position: 'absolute' })

const ShoppingBagIconLight = () => {
  const theme = useTheme()

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.9833 22.9188L18.9824 22.9188C14.3376 23.3604 9.66131 23.3604 5.01645 22.9188L5.01549 22.9187C4.00396 22.8239 3.0573 22.3788 2.339 21.6603C1.6207 20.9419 1.17586 19.9951 1.08127 18.9836L1.08116 18.9824C0.639613 14.3379 0.639613 9.66206 1.08116 5.01759L1.08126 5.01657C1.17603 4.00505 1.62096 3.05837 2.33925 2.3399C3.05754 1.62143 4.00413 1.17627 5.01562 1.08124L5.01645 1.08116C9.66131 0.639612 14.3376 0.639612 18.9824 1.08116L18.9831 1.08123C19.9947 1.17641 20.9414 1.62164 21.6599 2.34011C22.3784 3.05858 22.8236 4.00525 22.9188 5.01686L22.9188 5.01759C23.3604 9.66206 23.3604 14.3379 22.9188 18.9824L22.9188 18.9833C22.8238 19.9949 22.3786 20.9417 21.6601 21.6601C20.9416 22.3786 19.9949 22.8238 18.9833 22.9188Z"
        stroke={theme.colors.gray900}
        strokeWidth="1.5"
      />
    </svg>
  )
}

const ShoppingBagIconDark = () => {
  const theme = useTheme()

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 12C0 21.4491 2.91946 24 12.0146 24C21.1097 24 24 21.6003 24 12C24 2.39973 21.1097 0 12.0146 0C2.91946 0 0 2.55088 0 12Z"
        fill={theme.colors.gray1000}
      />
    </svg>
  )
}
