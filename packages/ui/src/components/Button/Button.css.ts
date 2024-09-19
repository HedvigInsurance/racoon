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

export const buttonVariant = styleVariants({
  primary: {
    backgroundColor: tokens.colors.buttonPrimary,
    color: tokens.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.buttonPrimaryHover,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.buttonPrimaryHover,
    },

    ':focus-visible': {
      boxShadow: tokens.shadow.focusAlt,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        backgroundColor: tokens.colors.buttonDisabled,
        color: tokens.colors.buttonDisabledText,
      },
    },
  },

  'primary-alt': [
    {
      backgroundColor: tokens.colors.buttonPrimaryAlt,
      color: tokens.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.buttonPrimaryAltHover,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.buttonPrimaryAltHover,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: tokens.colors.buttonDisabled,
          color: tokens.colors.buttonDisabledText,
        },
      },
    },
  ],

  secondary: [
    {
      backgroundColor: tokens.colors.buttonSecondary,
      color: tokens.colors.textPrimary,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.buttonSecondaryHover,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.buttonSecondaryHover,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: tokens.colors.buttonDisabled,
          color: tokens.colors.buttonDisabledText,
        },
      },
    },
  ],

  'secondary-alt': [
    {
      backgroundColor: tokens.colors.buttonSecondaryAlt,

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: tokens.colors.buttonSecondaryHoverAlt,
        },
      },

      ':active': {
        backgroundColor: tokens.colors.buttonDisabled,
      },

      selectors: {
        '&:disabled:not([data-loading])': {
          backgroundColor: tokens.colors.buttonDisabled,
          color: tokens.colors.buttonDisabledText,
        },
      },
    },
  ],

  ghost: {
    backgroundColor: 'transparent',
    color: tokens.colors.textPrimary,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.buttonGhostHover,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.buttonGhostHover,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: tokens.colors.buttonDisabledText,
        backgroundColor: 'transparent',
      },
    },
  },
  'ghost-alt': {
    backgroundColor: 'transparent',
    color: tokens.colors.textNegative,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: tokens.colors.buttonGhostAltHover,
        color: tokens.colors.textPrimary,
      },
    },

    ':active': {
      backgroundColor: tokens.colors.buttonGhostAltHover,
      color: tokens.colors.textPrimary,
    },

    selectors: {
      '&:disabled:not([data-loading])': {
        color: tokens.colors.buttonDisabledText,
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
    minWidth: '18.75rem',
    paddingInline: tokens.space.xl,
    fontSize: tokens.fontSizes.md,
    textAlign: 'center',
    borderRadius: tokens.radius.md,
  },
  icon: {
    borderRadius: tokens.radius.xxs,
    padding: tokens.space.xxxs,
  },
} as const

export const buttonSizeStyles = {
  base: {
    small: style(SIZE_STYLES.small),
    medium: style(SIZE_STYLES.medium),
    large: style(SIZE_STYLES.large),
    icon: style(SIZE_STYLES.icon),
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
    icon: style({
      '@media': {
        [minWidth.lg]: SIZE_STYLES.icon,
      },
    }),
  },
}

export const iconButtonStyles = style({ aspectRatio: '1', height: 'auto' })

export const childrenWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space.xs,
})

export const textWrapper = style({
  // Sine our fonts line height are not perfectly centered vertically,
  // offset the text 2px according to design
  marginTop: '-0.125rem',
})

export const centered = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})
