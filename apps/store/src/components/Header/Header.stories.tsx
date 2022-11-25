import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ComponentMeta, Story } from '@storybook/react'
import Link from 'next/link'
import { useBreakpoint } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Header, Wrapper as MockedHeaderWrapper } from './Header'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationPrimaryList,
  NavigationSecondaryList,
  NavigationTrigger,
  StyledArrowForwardIcon,
  StyledCrossIcon,
  StyledNavigationTrigger,
  TriggerIcon,
} from './HeaderStyles'
import { NavigationLink, SecondaryNavigationLink } from './NavigationLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { TopMenu } from './TopMenu'

export default {
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>

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
        {/* {isDesktop ? <TopMenu.Desktop /> : <TopMenu.Mobile />} */}
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

const MockedNavigationComponent = () => {
  const isDesktop = useBreakpoint('md')

  return (
    <NavigationPrimaryList>
      <NavigationMenuPrimitiveItem value="insurances">
        {isDesktop ? (
          <NavigationTrigger>
            Insurances <TriggerIcon size="16px" />
          </NavigationTrigger>
        ) : (
          <StyledNavigationTrigger>
            Insurances
            <StyledCrossIcon size="1rem" />
            <StyledArrowForwardIcon size="1rem" />
          </StyledNavigationTrigger>
        )}
        <NavigationMenuPrimitiveContent>
          <NavigationMenuPrimitive.Sub defaultValue="browseAll">
            <NavigationSecondaryList>
              <NavigationMenuPrimitive.Item value="browseAll">
                <SecondaryNavigationLink href={PageLink.store()}>
                  Browse All
                </SecondaryNavigationLink>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="homeInsurance">
                <SecondaryNavigationLink href="#">Home Insurances</SecondaryNavigationLink>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="accidentInsurance">
                <SecondaryNavigationLink href="#">Accident Insurance</SecondaryNavigationLink>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="carInsurance">
                <SecondaryNavigationLink href="#">Car Insurance</SecondaryNavigationLink>
              </NavigationMenuPrimitive.Item>
            </NavigationSecondaryList>
          </NavigationMenuPrimitive.Sub>
        </NavigationMenuPrimitiveContent>
      </NavigationMenuPrimitiveItem>

      <NavigationMenuPrimitive.Item value="onlyAtHedvig">
        <NavigationLink href="#">Only At Hedvig</NavigationLink>
      </NavigationMenuPrimitive.Item>

      <NavigationMenuPrimitive.Item value="ourStory">
        <NavigationLink href="#">Our Story</NavigationLink>
      </NavigationMenuPrimitive.Item>

      <NavigationMenuPrimitive.Item value="support">
        <NavigationLink href="#">Support</NavigationLink>
      </NavigationMenuPrimitive.Item>
    </NavigationPrimaryList>
  )
}
