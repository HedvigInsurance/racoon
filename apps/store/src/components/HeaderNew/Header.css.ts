import { createVar, style } from '@vanilla-extract/css'
import { minWidth, tokens, yStack } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import { MAX_WIDTH } from '../GridLayout/GridLayout.constants'
import {
  HEADER_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_MOBILE,
} from './HeaderMenuMobile/HeaderMenuMobile.css'

export const MENU_BAR_HEIGHT_DESKTOP = '4.5rem'
export const MENU_BAR_HEIGHT_PX = 72
const HEADER_HEIGHT_DESKTOP = `calc(${MENU_BAR_HEIGHT_DESKTOP} + ${tokens.space.xs})`

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${tokens.colors.red300}`,
  },
})

const ghostWrapperHeight = createVar()

export const ghostWrapper = style({
  vars: {
    [ghostWrapperHeight]: HEADER_HEIGHT_MOBILE,
  },

  position: 'relative',
  height: ghostWrapperHeight,

  zIndex: zIndexes.header,

  '@media': {
    [minWidth.lg]: {
      vars: {
        [ghostWrapperHeight]: HEADER_HEIGHT_DESKTOP,
      },
    },
  },

  selectors: {
    'body:has(main[data-overlay-menu=true]) &': {
      // Using negative margin to pull page's content bellow the menu causing the desired
      // 'menu overlay' behaviour. Before that was being implemented by removing the header
      // from doc's flow with absolute positioning. However, that solution doesn't play well
      // if we have banners/announcements on the screen.
      marginBottom: `calc(-1 * ${ghostWrapperHeight})`,
    },
  },
})

export const wrapper = style({
  top: 0,
  zIndex: zIndexes.header,
  width: '100%',
})

export const contentWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',
  paddingInline: tokens.space.md,
  height: MENU_BAR_HEIGHT_MOBILE,

  '@media': {
    [minWidth.lg]: {
      height: MENU_BAR_HEIGHT_DESKTOP,

      paddingInline: tokens.space.lg,
    },
  },
})

export const logoWrapper = style({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  // Fix to make sure line-height doesn't affect wrapper height
  fontSize: 0,
  flex: 1,
})

export const menuWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  gap: tokens.space.xs,
})

export const navigation = style({
  fontSize: tokens.fontSizes.xl,

  '@media': {
    [minWidth.lg]: {
      fontSize: tokens.fontSizes.md,
      top: 0,
    },
  },
})

export const HeaderMenuDesktop = style([
  navigation,
  {
    // Visually hide menu on mobile. It still needs to be present in the DOM for SEO purposes
    display: 'none',

    '@media': {
      [minWidth.lg]: {
        display: 'revert',
        // Ensure menu is left-aligned while cart item is right-aligned
        flexGrow: 1,
      },
    },
  },
])

export const navigationItem = style({
  '@media': {
    [minWidth.lg]: {
      selectors: {
        '&&': { borderBottom: 'unset' },

        // Position second item on the right side of the header
        '&:nth-child(2)': {
          marginLeft: 'auto',
        },
      },
    },
  },
})

export const navigationItemSubMenu = style({
  marginBottom: tokens.space.xxs,
  paddingBottom: tokens.space.md,
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.colors.buttonSecondary,

  '@media': {
    [minWidth.lg]: {
      marginBottom: tokens.space.none,
      paddingBottom: tokens.space.none,
      backgroundColor: 'transparent',
    },
  },
})

export const navigationContentMinWidth = createVar()

export const navigationItemGeneralMenu = style({
  vars: {
    [navigationContentMinWidth]: '16rem',
  },
  '@media': {
    [minWidth.lg]: {
      // Make general menu item first in the header menu in desktop
      ':last-child': {
        order: -1,
      },
    },
  },
})

export const navigationSecondaryItem = style({
  color: tokens.colors.textSecondaryOnGray,

  '@media': {
    [minWidth.lg]: {
      borderRadius: tokens.radius.md,
      color: tokens.colors.textPrimary,

      ':hover': {
        backgroundColor: tokens.colors.grayTranslucent100,
      },
    },
  },
})

export const navigationContent = style({
  // For SEO reasons, navigation content get's always mounted and it's appearance is toggled via CSS
  selectors: {
    '&[data-state="open"]': {
      display: 'block',
    },
    '&[data-state="closed"]': {
      display: 'none',
    },
  },
  '@media': {
    [minWidth.lg]: {
      position: 'absolute',
      minWidth: navigationContentMinWidth,
      paddingTop: `calc(${tokens.space.sm} + ${tokens.space.xs})`,

      selectors: {
        // Make sure the menu item to the right doesn't expand outside the viewport
        [`${navigationItem}:nth-child(2) &`]: {
          right: '0',
        },
      },
    },
  },
})

// Same component reused between mobile and desktop menus
export const navigationMenuWrapper = style({
  rowGap: tokens.space.lg,

  '@media': {
    [minWidth.lg]: {
      backgroundColor: tokens.colors.light,
      boxShadow: `0px 4px 10px -2px ${tokens.colors.translucent1}, 0px 2px 2px -1px ${tokens.colors.translucent2}`,
      border: `1px solid ${tokens.colors.borderTranslucent1}`,
      borderRadius: tokens.radius.xl,
      padding: tokens.space.md,
      rowGap: tokens.space.xs,
    },
  },
})

export const navigationPrimaryList = style({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT_MOBILE} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  paddingInline: tokens.space.md,
  paddingBottom: tokens.space.xl,
  overflowY: 'auto',

  '@media': {
    [minWidth.lg]: {
      position: 'static',
      flexDirection: 'row',
      alignItems: 'center',
      height: MENU_BAR_HEIGHT_DESKTOP,
      padding: tokens.space.none,
      gap: tokens.space.xs,
    },
  },
})

export const navigationSecondaryList = style({
  paddingTop: tokens.space.xs,

  '@media': {
    [minWidth.lg]: {
      paddingTop: tokens.space.none,
    },
  },
})

export const navigationProductList = style([
  yStack({ gap: 'xs' }),
  {
    marginBottom: tokens.space.md,
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,

    '@media': {
      [minWidth.lg]: {
        minWidth: '16rem',
      },
    },
  },
])
