import { createVar, style } from '@vanilla-extract/css'
import { minWidth, themeVars } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_DESKTOP,
  MENU_BAR_HEIGHT_MOBILE,
} from './Header.constants'

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${themeVars.colors.gray900}`,
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
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  top: 0,
  zIndex: zIndexes.header,

  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: themeVars.space.md,

  '@media': {
    [minWidth.lg]: {
      height: MENU_BAR_HEIGHT_DESKTOP,
      paddingInline: themeVars.space.xl,
    },
  },
})

export const logoWrapper = style({
  // Fix to make sure line-height doesn't affect wrapper height
  fontSize: 0,
  flex: 1,
})

export const contentWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: 1,
  gap: themeVars.space.xs,
})

export const navigation = style({
  fontSize: themeVars.fontSizes.xl,

  '@media': {
    [minWidth.lg]: {
      fontSize: themeVars.fontSizes.md,
      top: 0,
    },
  },
})

export const topMenuDesktop = style([
  navigation,
  {
    // Ensure menu is left-aligned while cart item is right-aligned
    flexGrow: 1,
  },
])

export const navigationItem = style({
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${themeVars.colors.borderOpaque1}`,
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
    paddingBlock: themeVars.space.lg,
    display: 'flex',
    alignItems: 'center',
    gap: themeVars.space.xxxl,
    whiteSpace: 'nowrap',

    '@media': {
      [minWidth.lg]: {
        paddingBlock: themeVars.space.xs,
        paddingInline: themeVars.space.md,

        borderRadius: themeVars.radius.sm,

        ':hover': {
          backgroundColor: themeVars.colors.grayTranslucent100,
        },

        selectors: {
          '&[data-state="open"]': {
            backgroundColor: themeVars.colors.grayTranslucent100,
          },
        },
      },
    },
  },
])

export const navigationSecondaryItem = style({
  padding: themeVars.space.md,
  marginLeft: themeVars.space.md,
  color: themeVars.colors.textPrimary,

  '@media': {
    [minWidth.lg]: {
      padding: `${themeVars.space.xs} ${themeVars.space.sm}`,
      margin: 0,
      borderRadius: themeVars.radius.sm,

      ':hover': {
        backgroundColor: themeVars.colors.grayTranslucent100,
      },
    },
  },
})

export const navigationContent = style({
  '@media': {
    [minWidth.lg]: {
      position: 'absolute',
      paddingTop: `calc(${themeVars.space.sm} + ${themeVars.space.xs})`,
    },
  },
})

export const navigationMenuWrapper = style({
  paddingBottom: themeVars.space.xl,

  '@media': {
    [minWidth.lg]: {
      backgroundColor: themeVars.colors.light,
      boxShadow: themeVars.shadow.default,
      borderRadius: themeVars.radius.sm,
      padding: themeVars.space.md,
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
  paddingInline: themeVars.space.md,
  paddingBottom: themeVars.space.xl,
  overflowY: 'auto',

  '@media': {
    [minWidth.lg]: {
      position: 'static',
      flexDirection: 'row',
      alignItems: 'center',
      height: MENU_BAR_HEIGHT_DESKTOP,
      padding: themeVars.space.none,
      gap: themeVars.space.xxs,
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

export const navigationProductList = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: themeVars.space.xs,
  fontSize: themeVars.fontSizes.md,
  color: themeVars.colors.textPrimary,

  '@media': {
    [minWidth.lg]: {
      minWidth: '16rem',
      columnGap: 0,
      gridTemplateColumns: 'none',
      gridAutoColumns: '7.5rem',
      gridAutoFlow: 'column',
    },
  },
})
