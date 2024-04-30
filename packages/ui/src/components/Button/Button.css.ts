import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, theme } from '../../theme'

export const baseButton = style({
  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',
  borderRadius: theme.radius.sm,
  whiteSpace: 'nowrap',
  lineHeight: 1,
  transition: `background-color ${theme.transitions.hover}, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  cursor: 'pointer',
  ':disabled': {
    cursor: 'default',
  },

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },
})

export const fullWidthStyles = style({
  width: '100%',
})

const shadow = style({
  boxShadow: theme.shadow.default,
  backdropFilter: 'blur(30px)',
})

export const buttonVariant = styleVariants({
  primary: {
    backgroundColor: theme.colors.gray1000,
    color: theme.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent900,
      },
    },

    ':active': {
      backgroundColor: theme.colors.grayTranslucent900,
    },

    ':focus-visible': {
      boxShadow: theme.shadow.focusAlt,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        backgroundColor: theme.colors.gray200,
        color: theme.colors.textDisabled,
      },
    },
  },

  'primary-alt': [
    shadow,
    {
      backgroundColor: theme.colors.green50,
      color: theme.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: theme.colors.green100,
        },
      },

      ':active': {
        backgroundColor: theme.colors.green100,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: theme.colors.gray200,
          color: theme.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  secondary: [
    shadow,
    {
      backgroundColor: theme.colors.translucent1,
      color: theme.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: theme.colors.translucent2,
        },
      },

      ':active': {
        backgroundColor: theme.colors.translucent2,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: theme.colors.gray200,
          color: theme.colors.textDisabled,
          boxShadow: 'none',
          backdropFilter: 'none',
        },
      },
    },
  ],

  'secondary-alt': [
    shadow,
    {
      backgroundColor: theme.colors.offWhite,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: theme.colors.grayTranslucentDark25,
        },
      },

      ':active': {
        backgroundColor: theme.colors.offWhite,
      },
    },
  ],

  ghost: {
    backgroundColor: 'transparent',
    color: theme.colors.textPrimary,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.translucent1,
      },
    },

    ':active': {
      backgroundColor: theme.colors.gray100,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: theme.colors.textDisabled,
        backgroundColor: 'transparent',
      },
    },
  },
  'ghost-alt': {
    backgroundColor: 'transparent',
    color: theme.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.offWhite,
        color: theme.colors.textPrimary,
      },
    },

    ':active': {
      backgroundColor: theme.colors.gray100,
      color: theme.colors.textPrimary,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: theme.colors.textDisabled,
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
    paddingInline: theme.space.md,
    fontSize: theme.fontSizes.xs,
    borderRadius: theme.radius.xs,
  },
  medium: {
    height: HEIGHT.medium,
    paddingInline: theme.space.md,
    fontSize: theme.fontSizes.md,
    borderRadius: theme.radius.sm,
  },
  large: {
    height: HEIGHT.large,
    width: '100%',
    paddingInline: theme.space.xl,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    borderRadius: theme.radius.md,
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
  gap: theme.space.xs,
})

export const centered = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})
