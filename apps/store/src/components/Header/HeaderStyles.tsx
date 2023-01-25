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
  fontSize: theme.fontSizes.xl,
  [mq.lg]: {
    fontSize: theme.fontSizes.sm,
    top: 0,
  },
})

export const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space.lg} 0`,
  ':not(:last-child)': {
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  [mq.lg]: {
    display: 'flex',
    padding: `${theme.space.xs} ${theme.space.md}`,
    ':not(:last-child)': {
      borderBottom: 'none',
    },
    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },
    },
    justifyContent: 'center',
  },
}))

export const NavigationMenuSecondaryItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space.md} ${theme.space.md} `,
  marginLeft: theme.space.md,

  [mq.lg]: {
    padding: `${theme.space.xs} ${theme.space.sm}`,
    margin: 0,
    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },
    },
  },
}))

export const NavigationMenuProductItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `${theme.space.md} ${theme.space.md} `,

  [mq.lg]: {
    padding: `${theme.space.xs} ${theme.space.sm}`,
    borderRadius: theme.radius.sm,
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
      top: `calc(${MENU_BAR_HEIGHT_DESKTOP} + ${theme.space.xs})`,
      backgroundColor: theme.colors.light,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
      padding: `${theme.space.md} ${theme.space.md}`,
    },
  }),
)

export const navigationTriggerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

export const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  ...focusableStyles,
}))

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT_MOBILE} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  padding: `0 ${theme.space.md} `,
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
  paddingTop: theme.space.xl,

  [mq.lg]: {
    padding: 0,
  },
}))

export const ProductNavigationList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space.xxs,
  rowGap: theme.space.md,
  fontSize: theme.fontSizes.sm,
  paddingTop: theme.space.xl,

  [mq.lg]: {
    padding: `${theme.space.md} 0`,
  },
}))

export const ButtonWrapper = styled.div(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.space.md,
  [mq.lg]: {
    paddingTop: 0,
  },
}))
