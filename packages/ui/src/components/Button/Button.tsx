import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { theme } from '../../lib/theme/theme'
import { ButtonSize, getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type LinkProps = {
  href?: string
  target?: string
  rel?: string
}

type CustomButtonProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt' | 'ghost'
  size?: ButtonSize
  loading?: boolean
} & LinkProps

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomButtonProps

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { variant = 'primary', loading, children, target, title, ...baseProps } = props

  const buttonChildren = (
    <>
      <span style={{ opacity: loading ? 0 : 1 }}>{children}</span>
      {loading && (
        <Centered>
          <DotPulse />
        </Centered>
      )}
    </>
  )

  const buttonProps = {
    ...baseProps,
    children: buttonChildren,
    as: props.href ? 'a' : 'button',
    ref,
    disabled: props.disabled || loading,
    ...(loading && { 'data-loading': true }),
    ...(target === '_blank' && { target: '_blank', rel: 'noreferrer' }),
    ...(title ? { title: title } : {}),
  } as const

  switch (variant) {
    case 'primary':
      return <PrimaryButton {...buttonProps} />
    case 'primary-alt':
      return <PrimaryAltButton {...buttonProps} />
    case 'secondary':
      return <SecondaryButton {...buttonProps} />
    case 'secondary-alt':
      return <SecondaryAltButton {...buttonProps} />
    case 'ghost':
      return <GhostButton {...buttonProps} />
  }
})

Button.displayName = 'Button'

const Centered = styled.span({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})

const StyledButton = styled.button<CustomButtonProps>(
  {
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
    '&:disabled': {
      cursor: 'default',
    },

    '&:focus-visible': {
      boxShadow: theme.shadow.focus,
    },
  },
  ({ size = 'large' }) => getButtonSizeStyles(size),
)

const PrimaryButton = styled(StyledButton)({
  backgroundColor: theme.colors.gray1000,
  color: theme.colors.textNegative,

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.grayTranslucent900,
    },
  },

  ':active': {
    backgroundColor: theme.colors.grayTranslucent900,
  },

  '&:not([data-loading])': {
    '&:disabled': {
      backgroundColor: theme.colors.gray200,
      color: theme.colors.textDisabled,
    },
  },

  '&:focus-visible': {
    boxShadow: theme.shadow.focusAlt,
  },
})

const shadow = css({
  boxShadow: theme.shadow.default,
  backdropFilter: 'blur(30px)',
})

const PrimaryAltButton = styled(StyledButton)(
  {
    backgroundColor: theme.colors.green50,
    color: theme.colors.textPrimary,

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.green100,
      },
    },

    ':active': {
      backgroundColor: theme.colors.green100,
    },

    '&:not([data-loading])': {
      '&:disabled': {
        backgroundColor: theme.colors.gray200,
        color: theme.colors.textDisabled,
        boxShadow: 'none',
        backdropFilter: 'none',
      },
    },
  },
  shadow,
)

const SecondaryButton = styled(StyledButton)(
  {
    backgroundColor: theme.colors.translucent1,
    color: theme.colors.textPrimary,

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.translucent2,
      },
    },

    ':active': {
      backgroundColor: theme.colors.translucent2,
    },

    '&:not([data-loading])': {
      '&:disabled': {
        backgroundColor: theme.colors.gray200,
        color: theme.colors.textDisabled,
        boxShadow: 'none',
        backdropFilter: 'none',
      },
    },
  },
  shadow,
)

const SecondaryAltButton = styled(SecondaryButton)({
  backgroundColor: theme.colors.offWhite,

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.grayTranslucentDark25,
    },
  },

  ':active': {
    backgroundColor: theme.colors.offWhite,
  },
})

const GhostButton = styled(StyledButton)({
  backgroundColor: 'transparent',
  color: theme.colors.textPrimary,

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.translucent1,
    },
  },

  '&:active': {
    backgroundColor: theme.colors.gray100,
  },

  '&:not([data-loading])': {
    '&:disabled': {
      color: theme.colors.textDisabled,
      backgroundColor: 'transparent',
    },
  },
})
