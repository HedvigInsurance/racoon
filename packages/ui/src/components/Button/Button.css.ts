import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, tokens } from '../../theme'

export const baseButton = style({
  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',
  borderRadius: tokens.radius.sm,
  whiteSpace: 'nowrap',
  lineHeight: 1,
  transition: `background-color ${tokens.transitions.hover}, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  cursor: 'pointer',
  ':disabled': {
    cursor: 'default',
  },

  ':focus-visible': {
    boxShadow: tokens.shadow.focus,
  },
})

export const fullWidthStyles = style({
  width: '100%',
})

const shadow = style({
  boxShadow: tokens.shadow.default,
  backdropFilter: 'blur(30px)',
})

export const buttonVariant = styleVariants({
  primary: {
    backgroundColor: tokens.colors.gray1000,
    color: tokens.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.grayTranslucent900,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.grayTranslucent900,
    },

    ':focus-visible': {
      boxShadow: tokens.shadow.focusAlt,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        backgroundColor: tokens.colors.gray200,
        color: tokens.colors.textDisabled,
      },
    },
  },

  'primary-alt': [
    shadow,
    {
      backgroundColor: tokens.colors.green50,
      color: tokens.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.green100,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.green100,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: tokens.colors.gray200,
          color: tokens.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  secondary: [
    shadow,
    {
      backgroundColor: tokens.colors.translucent1,
      color: tokens.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.translucent2,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.translucent2,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: tokens.colors.gray200,
          color: tokens.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  'secondary-alt': [
    shadow,
    {
      backgroundColor: tokens.colors.offWhite,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.grayTranslucentDark25,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.offWhite,
      },
    },
  ],

  ghost: {
    backgroundColor: 'transparent',
    color: tokens.colors.textPrimary,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.translucent1,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.gray100,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: tokens.colors.textDisabled,
        backgroundColor: 'transparent',
      },
    },
  },
  'ghost-alt': {
    backgroundColor: 'transparent',
    color: tokens.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.offWhite,
        color: tokens.colors.textPrimary,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.gray100,
      color: tokens.colors.textPrimary,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: tokens.colors.textDisabled,
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
    paddingInline: tokens.space.md,
    fontSize: tokens.fontSizes.xs,
    borderRadius: tokens.radius.xs,
  },
  medium: {
    height: HEIGHT.medium,
    paddingInline: tokens.space.md,
    fontSize: tokens.fontSizes.md,
    borderRadius: tokens.radius.sm,
  },
  large: {
    height: HEIGHT.large,
    width: '100%',
    paddingInline: tokens.space.xl,
    fontSize: tokens.fontSizes.md,
    textAlign: 'center',
    borderRadius: tokens.radius.md,
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
  gap: tokens.space.xs,
})

export const centered = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})
