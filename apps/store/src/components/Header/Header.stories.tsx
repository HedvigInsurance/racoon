import styled from '@emotion/styled'
import { ComponentMeta, Story } from '@storybook/react'
import Link from 'next/link'
import { useBreakpoint } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Header, Wrapper as MockedHeaderWrapper } from './Header'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { TopMenu } from './TopMenu'

export default {
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>

export const MockedShoppingCartMenuItem = ({ count = 0 }) => {
  return (
    <ShoppingCartMenuItemWrapper>
      <Link href={PageLink.cart()} passHref legacyBehavior>
        <StyledLink tabIndex={0} aria-label="shopping cart">
          <ShoppingBagIcon />
        </StyledLink>
      </Link>
      <Counter value={count} />
    </ShoppingCartMenuItemWrapper>
  )
}

const ShoppingCartMenuItemWrapper = styled.div({
  position: 'relative',
  lineHeight: 0,
})

const StyledLink = styled.a(({ theme }) => ({
  display: 'inline-block',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}))

type CounterProps = { value: number }

const Counter = ({ value }: CounterProps) => {
  if (value <= 0) return null

  return <StyledCounter>{value}</StyledCounter>
}

const StyledCounter = styled.span(({ theme }) => ({
  pointerEvents: 'none',
  position: 'absolute',
  top: 1,
  right: -6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: theme.colors.gray900,
  color: theme.colors.gray200,
  fontSize: 10,
  fontWeight: 'bold',
}))

export type TopMenuMobileProps = {
  isOpen?: boolean
  currentActiveItem?: string
  count?: number
}

const Template: Story<TopMenuMobileProps> = (props) => {
  const isDesktop = useBreakpoint('md')

  return (
    <>
      <MockedHeaderWrapper topOffset={0}>
        {isDesktop ? <TopMenu.Desktop /> : <TopMenu.Mobile isOpen={props.isOpen} />}
        <MockedShoppingCartMenuItem count={props.count} />
      </MockedHeaderWrapper>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
  count: 0,
}
