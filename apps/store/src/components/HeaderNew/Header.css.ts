import { createVar, style } from '@vanilla-extract/css'
import { minWidth, tokens, yStack } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import { MAX_WIDTH } from '../GridLayout/GridLayout.constants'
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_DESKTOP,
  MENU_BAR_HEIGHT_MOBILE,
} from './Header.constants'

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${tokens.colors.gray900}`,
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
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${tokens.colors.borderOpaque1}`,
    },
  },

  '@media': {
    [minWidth.lg]: {
      selectors: {
        '&&': { borderBottom: 'unset' },
      },
    },
  },
})

export const navigationTriggerLink = style([
  focusableStyles,
  {
    paddingBlock: tokens.space.lg,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.space.xxxl,
    whiteSpace: 'nowrap',

    '@media': {
      [minWidth.lg]: {
        paddingBlock: tokens.space.xs,
        paddingInline: tokens.space.md,

        borderRadius: tokens.radius.sm,

        ':hover': {
          backgroundColor: tokens.colors.grayTranslucent100,
        },

        selectors: {
          '&[data-state="open"]': {
            backgroundColor: tokens.colors.grayTranslucent100,
          },
        },
      },
    },
  },
])

export const navigationSecondaryItem = style({
  padding: tokens.space.md,
  marginLeft: tokens.space.md,
  color: tokens.colors.textPrimary,

  '@media': {
    [minWidth.lg]: {
      padding: `${tokens.space.xs} ${tokens.space.sm}`,
      margin: 0,
      borderRadius: tokens.radius.sm,

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
      paddingTop: `calc(${tokens.space.sm} + ${tokens.space.xs})`,
    },
  },
})

// Same component reused between mobile and desktop menus
export const navigationMenuWrapper = style({
  paddingBottom: tokens.space.xl,
  rowGap: tokens.space.lg,

  '@media': {
    [minWidth.lg]: {
      backgroundColor: tokens.colors.light,
      boxShadow: tokens.shadow.default,
      borderRadius: tokens.radius.sm,
      padding: tokens.space.md,
      rowGap: tokens.space.md,
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
      gap: tokens.space.xxs,
    },
  },
})

export const navigationSecondaryList = style({
  display: 'block',

  '@media': {
    [minWidth.lg]: {
      padding: 0,
    },
  },
})

export const navigationProductList = style([
  yStack({ gap: 'xs' }),
  {
    marginBottom: tokens.space.lg,
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,

    '@media': {
      [minWidth.lg]: {
        minWidth: '16rem',
        marginBottom: tokens.space.md,
      },
    },
  },
])
