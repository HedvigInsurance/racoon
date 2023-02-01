import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ComponentMeta, Story } from '@storybook/react'
import Link from 'next/link'
import { theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Header, Wrapper as MockedHeaderWrapper } from './Header'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationSecondaryList,
  NavigationTrigger,
} from './HeaderStyles'
import { NavigationLink, SecondaryNavigationLink } from './NavigationLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { TopMenuDesktop } from './TopMenuDesktop/TopMenuDesktop'
import { TopMenuMobile } from './TopMenuMobile/TopMenuMobile'

export default {
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>

const ShoppingCartMenuItemWrapper = styled.div({
  position: 'relative',
  lineHeight: 0,
})

const StyledLink = styled(Link)({
  display: 'inline-block',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
})

export const MockedShoppingCartMenuItem = ({ count = 0 }) => {
  return (
    <ShoppingCartMenuItemWrapper>
      <StyledLink href={PageLink.cart()} tabIndex={0} aria-label="shopping cart">
        <ShoppingBagIcon count={count} />
      </StyledLink>
    </ShoppingCartMenuItemWrapper>
  )
}

const MockedNavItems = () => {
  return (
    <>
      <NavigationMenuPrimitiveItem value="Home">
        <NavigationLink href="#">Home</NavigationLink>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Insurances">
        <NavigationTrigger name="Insurances" />
        <NavigationMenuPrimitiveContent>
          <NavigationMenuPrimitive.Sub defaultValue="Insurances">
            <NavigationSecondaryList>
              <NavigationMenuPrimitiveItem key="1" value="Browse all">
                <SecondaryNavigationLink href="#">Browse all</SecondaryNavigationLink>
              </NavigationMenuPrimitiveItem>
              <NavigationMenuPrimitiveItem key="2" value="Hedvig Home">
                <SecondaryNavigationLink href="#">Hedvig Home</SecondaryNavigationLink>
              </NavigationMenuPrimitiveItem>
              <NavigationMenuPrimitiveItem key="3" value="Hedvig Accident">
                <SecondaryNavigationLink href="#">Hedvig Accident</SecondaryNavigationLink>
              </NavigationMenuPrimitiveItem>
            </NavigationSecondaryList>
          </NavigationMenuPrimitive.Sub>
        </NavigationMenuPrimitiveContent>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Why Hedvig?">
        <NavigationLink href="#">Why Hedvig?</NavigationLink>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Only at Hedvig">
        <NavigationLink href="#">Only at Hedvig</NavigationLink>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Support">
        <NavigationLink href="#">Support</NavigationLink>
      </NavigationMenuPrimitiveItem>
    </>
  )
}

export type TopMenuProps = {
  isOpen?: boolean
  currentActiveItem?: string
  count?: number
}

const Template: Story<TopMenuProps> = (props) => {
  return (
    <>
      <MockedHeaderWrapper>
        <TopMenuDesktop>
          <MockedNavItems />
        </TopMenuDesktop>

        <TopMenuMobile>
          <MockedNavItems />
        </TopMenuMobile>

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
