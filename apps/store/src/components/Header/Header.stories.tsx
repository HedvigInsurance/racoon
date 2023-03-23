import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import Link from 'next/link'
import { theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Header, Wrapper as MockedHeaderWrapper } from './Header'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationMenuProductItem,
  NavigationTrigger,
  ProductNavigationList,
} from './HeaderStyles'
import { NavigationLink, ProductNavigationLink } from './NavigationLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { TopMenuDesktop } from './TopMenuDesktop/TopMenuDesktop'
import { TopMenuMobile } from './TopMenuMobile/TopMenuMobile'

export default {
  title: 'Header',
  component: Header,
} as Meta<typeof Header>

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
      <NavigationMenuPrimitiveItem value="Insurances">
        <NavigationTrigger name="Insurances">Insurances</NavigationTrigger>
        <NavigationMenuPrimitiveContent>
          <NavigationMenuPrimitive.Sub defaultValue="Insurances">
            <ProductNavigationList>
              <NavigationMenuProductItem key="1" value="Browse all">
                <ProductNavigationLink href="#">Browse all</ProductNavigationLink>
              </NavigationMenuProductItem>
              <NavigationMenuProductItem key="2" value="Hedvig Home">
                <ProductNavigationLink href="#">Hedvig Home</ProductNavigationLink>
              </NavigationMenuProductItem>
              <NavigationMenuProductItem key="3" value="Hedvig Accident">
                <ProductNavigationLink href="#">Hedvig Accident</ProductNavigationLink>
              </NavigationMenuProductItem>
            </ProductNavigationList>
          </NavigationMenuPrimitive.Sub>
        </NavigationMenuPrimitiveContent>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Support">
        <NavigationLink href="#">Support</NavigationLink>
      </NavigationMenuPrimitiveItem>
      <NavigationMenuPrimitiveItem value="Why Hedvig?">
        <NavigationLink href="#">About Hedvig</NavigationLink>
      </NavigationMenuPrimitiveItem>
    </>
  )
}

export type TopMenuProps = {
  isOpen: boolean
  currentActiveItem?: string
  count?: number
}

const Template: StoryFn<TopMenuProps> = (props) => {
  return (
    <>
      <MockedHeaderWrapper>
        <TopMenuDesktop>
          <MockedNavItems />
        </TopMenuDesktop>

        <TopMenuMobile isOpen={props.isOpen} setIsOpen={() => {}}>
          <MockedNavItems />
        </TopMenuMobile>

        <MockedShoppingCartMenuItem count={props.count} />
      </MockedHeaderWrapper>
    </>
  )
}

export const DesktopMenu = Template.bind({})
DesktopMenu.args = {
  isOpen: false,
  currentActiveItem: 'insurances',
  count: 0,
}

export const MobileMenu = Template.bind({})
MobileMenu.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
  count: 0,
}
MobileMenu.parameters = {
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphone12',
  },
}
