import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { navigationItem, navigationProductList, wrapper } from './Header.css'
import { NavigationLink, ProductNavigationLink } from './NavigationLink/NavigationLink'
import { NavigationTrigger } from './NavigationTrigger'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { TopMenu } from './TopMenu/TopMenu'

export default {
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
  const locale = 'se-en'

  return (
    <ShoppingCartMenuItemWrapper>
      <StyledLink href={PageLink.cart({ locale })} tabIndex={0} aria-label="shopping cart">
        <ShoppingBagIcon count={count} />
      </StyledLink>
    </ShoppingCartMenuItemWrapper>
  )
}

const MockedNavItems = () => {
  return (
    <>
      <NavigationMenuPrimitive.Item className={navigationItem} value="Insurances">
        <NavigationTrigger href="#">Insurances</NavigationTrigger>
        <NavigationMenuPrimitive.Content>
          <NavigationMenuPrimitive.Sub defaultValue="Insurances">
            <NavigationMenuPrimitive.List className={navigationProductList}>
              <NavigationMenuPrimitive.Item key="1" value="Browse all">
                <ProductNavigationLink href="#">Browse all</ProductNavigationLink>
              </NavigationMenuPrimitive.Item>
              <NavigationMenuPrimitive.Item key="2" value="Hedvig Home">
                <ProductNavigationLink href="#">Hedvig Home</ProductNavigationLink>
              </NavigationMenuPrimitive.Item>
              <NavigationMenuPrimitive.Item key="3" value="Hedvig Accident">
                <ProductNavigationLink href="#">Hedvig Accident</ProductNavigationLink>
              </NavigationMenuPrimitive.Item>
            </NavigationMenuPrimitive.List>
          </NavigationMenuPrimitive.Sub>
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>
      <NavigationMenuPrimitive.Item className={navigationItem} value="Support">
        <NavigationLink href="#">Support</NavigationLink>
      </NavigationMenuPrimitive.Item>
      <NavigationMenuPrimitive.Item className={navigationItem} value="Why Hedvig?">
        <NavigationLink href="#">About Hedvig</NavigationLink>
      </NavigationMenuPrimitive.Item>
    </>
  )
}

export type TopMenuProps = {
  currentActiveItem?: string
  count?: number
}

const Template: StoryFn<TopMenuProps> = (props) => {
  return (
    <>
      <motion.header className={wrapper}>
        <TopMenu>
          <MockedNavItems />
        </TopMenu>

        <MockedShoppingCartMenuItem count={props.count} />
      </motion.header>
    </>
  )
}

export const DesktopMenu = {
  render: Template,

  args: {
    isOpen: false,
    currentActiveItem: 'insurances',
    count: 0,
  },
}

export const MobileMenu = {
  render: Template,

  args: {
    isOpen: true,
    currentActiveItem: 'insurances',
    count: 0,
  },

  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
  },
}
