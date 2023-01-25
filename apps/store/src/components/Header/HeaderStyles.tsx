import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { mq, theme } from 'ui'

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
  padding: `${theme.space[5]} 0`,
  ':not(:last-child)': {
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  [mq.lg]: {
    display: 'flex',
    padding: `${theme.space[2]} ${theme.space[4]}`,
    ':not(:last-child)': {
      borderBottom: 'none',
    },
    borderRadius: theme.radius[1],
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },
    },
    justifyContent: 'center',
  },
}))

export const NavigationMenuSecondaryItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space[4]} ${theme.space[4]} `,
  marginLeft: theme.space[4],

  [mq.lg]: {
    padding: `${theme.space[2]} ${theme.space[3]}`,
    margin: 0,
    borderRadius: theme.radius[1],
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },
    },
  },
}))

export const NavigationMenuProductItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space[4]} ${theme.space[4]} `,

  [mq.lg]: {
    padding: `${theme.space[2]} ${theme.space[3]}`,
    borderRadius: theme.radius[1],
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },
    },
  },
}))

export const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)(
  ({ theme }) => ({
    [mq.lg]: {
      position: 'absolute',
      top: `calc(${MENU_BAR_HEIGHT_DESKTOP} + ${theme.space[2]})`,
      backgroundColor: theme.colors.light,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderRadius: theme.radius[1],
      padding: `${theme.space[4]} ${theme.space[4]}`,
    },
  }),
)

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
  },
}))

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  display: 'block',
  paddingTop: theme.space[6],

  [mq.lg]: {
    padding: 0,
  },
}))

export const ProductNavigationList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space[1],
  rowGap: theme.space[4],
  fontSize: theme.fontSizes[2],
  paddingTop: theme.space[6],

  [mq.lg]: {
    padding: `${theme.space[4]} 0`,
  },
}))

export const ButtonWrapper = styled.div(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.space[4],
  [mq.lg]: {
    paddingTop: 0,
  },
}))
