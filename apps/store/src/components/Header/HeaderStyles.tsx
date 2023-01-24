import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronIcon, mq, theme } from 'ui'

export const MENU_BAR_HEIGHT_MOBILE = '3rem'

export const MENU_BAR_HEIGHT_DESKTOP = '4.5rem'

export const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

export const Navigation = styled(NavigationMenuPrimitive.Root)({
  backgroundColor: theme.colors.light,
  fontSize: theme.fontSizes[5],
  [mq.lg]: {
    fontSize: theme.fontSizes[3],
    top: 0,
  },
})

export const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  borderBottom: `1px solid ${theme.colors.border}`,
  padding: `${theme.space[5]} 0`,
  [mq.lg]: {
    padding: `0 ${theme.space[4]}`,
  },
}))

export const NavigationMenuSecondaryItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space[4]} 0`,

  [mq.lg]: {
    padding: `0 ${theme.space[4]}`,
  },
}))

export const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)(() => ({
  [mq.lg]: {
    position: 'absolute',
    top: `calc(${MENU_BAR_HEIGHT_DESKTOP} + 0.5rem)`,
  },
}))

export const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const navigationTriggerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

export const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT_MOBILE} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  padding: `0 ${theme.space[4]} `,
  backgroundColor: theme.colors.light,

  [mq.lg]: {
    position: 'static',
    flexDirection: 'row',
    alignItems: 'center',
    height: MENU_BAR_HEIGHT_DESKTOP,
    padding: '0 0 0 0.5rem',
  },
}))

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  padding: `${theme.space[4]} 0`,

  [mq.lg]: {
    gap: 'none',
    rowGap: theme.space[4],
    padding: `${theme.space[4]} 0`,
    borderRadius: '0.5rem',
    backgroundColor: theme.colors.light,
  },
}))
