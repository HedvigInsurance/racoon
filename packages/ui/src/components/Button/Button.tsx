import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { theme } from '../../lib/theme/theme'

const HEIGHT = {
  large: '3.25rem',
  medium: '2.5rem',
  small: '2.125rem',
}

type LinkProps = {
  href?: string
  target?: string
  rel?: string
}

export type CustomButtonProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'ghost'
  size?: 'large' | 'medium' | 'small'
  loading?: boolean
} & LinkProps

type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomButtonProps

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { variant = 'primary', loading, children, ...baseProps } = props

  const buttonChildren = loading ? (
    <Centered>
      <LoadingSpinner size={props.size === 'small' ? theme.fontSizes.xs : theme.fontSizes.md} />
    </Centered>
  ) : (
    children
  )

  const buttonProps = {
    ...baseProps,
    children: buttonChildren,
    as: props.href ? 'a' : 'button',
    ref,
    ...(loading && { 'data-loading': true }),
  } as const

  switch (variant) {
    case 'primary':
      return <PrimaryButton {...buttonProps} />
    case 'primary-alt':
      return <PrimaryAltButton {...buttonProps} />
    case 'secondary':
      return <SecondaryButton {...buttonProps} />
    case 'ghost':
      return <GhostButton {...buttonProps} />
  }
})

Button.displayName = 'Button'

const Centered = styled.div({ display: 'flex', justifyContent: 'center' })

const StyledButton = styled.button<CustomButtonProps>(({ size = 'large' }) => ({
  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',

  borderRadius: theme.radius.sm,

  whiteSpace: 'nowrap',
  lineHeight: 1,
  transition:
    'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',

  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  ...(size === 'large' && {
    height: HEIGHT.large,
    width: '100%',
    paddingInline: theme.space[6],

    textAlign: 'center',
    fontSize: theme.fontSizes[3],
  }),

  ...(size === 'medium' && {
    height: HEIGHT.medium,
    paddingInline: theme.space[4],
    fontSize: theme.fontSizes[3],
  }),

  ...(size === 'small' && {
    height: HEIGHT.small,
    paddingInline: theme.space[4],
    fontSize: theme.fontSizes[1],
  }),

  cursor: 'pointer',
  '&:disabled': {
    cursor: 'default',
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },
}))

const PrimaryButton = styled(StyledButton)({
  backgroundColor: theme.colors.gray1000,
  color: theme.colors.textNegative,

  '&:hover': {
    // TODO: update to use translucent gray900
    backgroundColor: theme.colors.gray900,
  },

  '&:not([data-loading])': {
    '&:disabled': {
      backgroundColor: theme.colors.gray200,
      color: theme.colors.textDisabled,
    },
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.gray500}`,
  },
})

const shadow = css({
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(30px)',
})

const PrimaryAltButton = styled(StyledButton)(
  {
    backgroundColor: theme.colors.green50,
    color: theme.colors.textPrimary,

    '&:hover': {
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
    // TODO: update to use translucent gray100
    backgroundColor: theme.colors.gray100,
    color: theme.colors.textPrimary,

    '&:hover': {
      // TODO: update to use translucent gray200
      backgroundColor: theme.colors.gray200,
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

const GhostButton = styled(StyledButton)({
  backgroundColor: 'transparent',
  color: theme.colors.textPrimary,

  '&:hover': {
    // TODO: update to use translucent gray100
    backgroundColor: theme.colors.gray100,
  },

  '&:not([data-loading])': {
    '&:disabled': {
      color: theme.colors.textDisabled,
      backgroundColor: 'transparent',
    },
  },
})
