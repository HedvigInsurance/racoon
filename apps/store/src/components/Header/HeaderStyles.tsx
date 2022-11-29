import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ArrowForwardIcon, ChevronIcon, CrossIcon, mq, theme } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP } from './Header'

export const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

export const Navigation = styled(NavigationMenuPrimitive.Root)({
  backgroundColor: theme.colors.gray200,
  fontSize: theme.fontSizes[5],
  [mq.md]: {
    fontSize: theme.fontSizes[3],
  },
})

export const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  [mq.md]: {
    padding: `0 ${theme.space[4]}`,
  },
}))

export const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)(() => ({
  [mq.md]: {
    position: 'absolute',
    top: `calc(${MENU_BAR_HEIGHT_DESKTOP} + 0.5rem)`,
    left: '0.5rem',
  },
}))

export const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

export const StyledCrossIcon = styled(CrossIcon)()
export const StyledArrowForwardIcon = styled(ArrowForwardIcon)()

export const StyledNavigationTrigger = styled(NavigationTrigger)({
  ['&[data-state=open]']: {
    [StyledArrowForwardIcon.toString()]: { display: 'none' },
  },
  '&[data-state=closed]': {
    [StyledCrossIcon.toString()]: { display: 'none' },
  },
})

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[5],
  padding: `${theme.space[8]} ${theme.space[4]} 0`,
  backgroundColor: theme.colors.gray100,

  [mq.md]: {
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
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space[1],
  rowGap: theme.space[4],
  fontSize: theme.fontSizes[2],
  paddingTop: theme.space[6],

  [mq.md]: {
    gap: 'none',
    rowGap: theme.space[4],
    padding: `${theme.space[4]} 0`,
    borderRadius: '0.5rem',
    backgroundColor: theme.colors.gray100,
    marginTop: theme.space[6],
  },
}))
