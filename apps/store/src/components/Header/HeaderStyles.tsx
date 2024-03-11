import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import { mq, theme } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './constants'

export const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

export const Navigation = styled(NavigationMenuPrimitive.Root)({
  fontSize: theme.fontSizes.xl,

  [mq.lg]: {
    fontSize: theme.fontSizes.md,
    top: 0,
  },
})

export const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)({
  ':not(:last-child)': {
    borderBottom: `1px solid ${theme.colors.borderOpaque1}`,
  },

  [mq.lg]: { '&&': { borderBottom: 'unset' } },
})

export const NavigationTrigger = (props: LinkProps & { children: string }) => {
  return (
    <NavigationMenuPrimitive.Trigger asChild>
      <NavigationTriggerLink {...props} />
    </NavigationMenuPrimitive.Trigger>
  )
}

const NavigationTriggerLink = styled(Link)({
  paddingBlock: theme.space.lg,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  whiteSpace: 'nowrap',
  ...focusableStyles,

  [mq.lg]: {
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.md,

    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },

    '&[data-state="open"]': {
      backgroundColor: theme.colors.grayTranslucent100,
    },
  },
})

export const NavigationMenuSecondaryItem = styled(NavigationMenuPrimitive.Item)({
  padding: `${theme.space.md} ${theme.space.md} `,
  marginLeft: theme.space.md,
  color: theme.colors.textPrimary,

  [mq.lg]: {
    padding: `${theme.space.xs} ${theme.space.sm}`,
    margin: 0,
    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
})

export const NavigationMenuProductItem = styled(NavigationMenuPrimitive.Item)()

export const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)({
  [mq.lg]: {
    position: 'absolute',
    paddingTop: `calc(${theme.space.sm} + ${theme.space.xs})`,
  },
})

export const NavigationMenuListWrapper = styled.div({
  paddingBottom: theme.space.xl,

  [mq.lg]: {
    backgroundColor: theme.colors.light,
    boxShadow: theme.shadow.default,
    borderRadius: theme.radius.sm,
    padding: theme.space.md,
  },
})

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT_MOBILE} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  paddingInline: theme.space.md,
  paddingBottom: theme.space.xl,
  overflowY: 'auto',

  [mq.lg]: {
    position: 'static',
    flexDirection: 'row',
    alignItems: 'center',
    height: MENU_BAR_HEIGHT_DESKTOP,
    padding: theme.space.none,
    gap: theme.space.xxs,
  },
})

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)({
  display: 'block',

  [mq.lg]: {
    padding: 0,
  },
})

export const ProductNavigationList = styled(NavigationMenuPrimitive.List)({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.space.xs,
  fontSize: theme.fontSizes.md,
  color: theme.colors.textPrimary,

  [mq.lg]: {
    minWidth: '16rem',
    columnGap: 0,
    gridTemplateColumns: 'none',
    gridAutoColumns: '7.5rem',
    gridAutoFlow: 'column',
  },
})
