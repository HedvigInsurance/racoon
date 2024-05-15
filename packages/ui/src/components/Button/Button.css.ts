import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, themeVars } from '../../theme'

export const baseButton = style({
  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',
  borderRadius: themeVars.radius.sm,
  whiteSpace: 'nowrap',
  lineHeight: 1,
  transition: `background-color ${themeVars.transitions.hover}, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  cursor: 'pointer',
  ':disabled': {
    cursor: 'default',
  },

  ':focus-visible': {
    boxShadow: themeVars.shadow.focus,
  },
})

export const fullWidthStyles = style({
  width: '100%',
})

const shadow = style({
  boxShadow: themeVars.shadow.default,
  backdropFilter: 'blur(30px)',
})

export const buttonVariant = styleVariants({
  primary: {
    backgroundColor: themeVars.colors.gray1000,
    color: themeVars.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: themeVars.colors.grayTranslucent900,
      },
    },

    ':active': {
      backgroundColor: themeVars.colors.grayTranslucent900,
    },

    ':focus-visible': {
      boxShadow: themeVars.shadow.focusAlt,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        backgroundColor: themeVars.colors.gray200,
        color: themeVars.colors.textDisabled,
      },
    },
  },

  'primary-alt': [
    shadow,
    {
      backgroundColor: themeVars.colors.green50,
      color: themeVars.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: themeVars.colors.green100,
        },
      },

      ':active': {
        backgroundColor: themeVars.colors.green100,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: themeVars.colors.gray200,
          color: themeVars.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  secondary: [
    shadow,
    {
      backgroundColor: themeVars.colors.translucent1,
      color: themeVars.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: themeVars.colors.translucent2,
        },
      },

      ':active': {
        backgroundColor: themeVars.colors.translucent2,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: themeVars.colors.gray200,
          color: themeVars.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  'secondary-alt': [
    shadow,
    {
      backgroundColor: themeVars.colors.offWhite,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: themeVars.colors.grayTranslucentDark25,
        },
      },

      ':active': {
        backgroundColor: themeVars.colors.offWhite,
      },
    },
  ],

  ghost: {
    backgroundColor: 'transparent',
    color: themeVars.colors.textPrimary,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: themeVars.colors.translucent1,
      },
    },

    ':active': {
      backgroundColor: themeVars.colors.gray100,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: themeVars.colors.textDisabled,
        backgroundColor: 'transparent',
      },
    },
  },
  'ghost-alt': {
    backgroundColor: 'transparent',
    color: themeVars.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: themeVars.colors.offWhite,
        color: themeVars.colors.textPrimary,
      },
    },

    ':active': {
      backgroundColor: themeVars.colors.gray100,
      color: themeVars.colors.textPrimary,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: themeVars.colors.textDisabled,
        backgroundColor: 'transparent',
      },
    },
  },
})

const HEIGHT = {
  small: '2rem',
  medium: '2.5rem',
  large: '3.5rem',
}

const SIZE_STYLES = {
  small: {
    height: HEIGHT.small,
    paddingInline: themeVars.space.md,
    fontSize: themeVars.fontSizes.xs,
    borderRadius: themeVars.radius.xs,
  },
  medium: {
    height: HEIGHT.medium,
    paddingInline: themeVars.space.md,
    fontSize: themeVars.fontSizes.md,
    borderRadius: themeVars.radius.sm,
  },
  large: {
    height: HEIGHT.large,
    width: '100%',
    paddingInline: themeVars.space.xl,
    fontSize: themeVars.fontSizes.md,
    textAlign: 'center',
    borderRadius: themeVars.radius.md,
  },
} as const

export const buttonSizeStyles = {
  base: {
    small: style(SIZE_STYLES.small),
    medium: style(SIZE_STYLES.medium),
    large: style(SIZE_STYLES.large),
  },
  lg: {
    small: style({
      '@media': {
        [minWidth.lg]: SIZE_STYLES.small,
      },
    }),
    medium: style({
      '@media': {
        [minWidth.lg]: SIZE_STYLES.medium,
      },
    }),
    large: style({
      '@media': {
        [minWidth.lg]: SIZE_STYLES.large,
      },
    }),
  },
}

export const childrenWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.space.xs,
})

export const centered = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})
