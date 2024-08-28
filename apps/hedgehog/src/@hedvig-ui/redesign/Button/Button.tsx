import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { theme } from '../theme'
import { ButtonSize, getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type LinkProps = {
  href?: string
  target?: string
  rel?: string
}

type CustomButtonProps = {
  variant?:
    | 'primary'
    | 'primary-alt'
    | 'secondary'
    | 'secondary-alt'
    | 'ghost'
    | 'danger'
  size?: ButtonSize
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start' | 'flex-end'
  loading?: boolean
  Icon?: ReactNode
} & LinkProps

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomButtonProps

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    variant = 'primary',
    loading,
    children,
    target,
    title,
    rel,
    ...baseProps
  } = props

  const buttonChildren = (
    <>
      <ChildrenWrapper style={{ opacity: loading ? 0 : 1 }}>
        {props.Icon} {children}
      </ChildrenWrapper>
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
    ...(target === '_blank' && { target: '_blank', rel: 'noopener' }),
    ...(rel ? { rel: rel } : {}),
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
    case 'danger':
      return <DangerButton {...buttonProps} />
  }
})

Button.displayName = 'Button'

const Centered = styled.span({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
})

const ChildrenWrapper = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
})

const StyledButton = styled.button<CustomButtonProps>(
  {
    // opt out of double tap to zoom to immediately respond to taps
    touchAction: 'manipulation',

    borderRadius: theme.radius.sm,
    border: 'none',

    whiteSpace: 'nowrap',
    lineHeight: 1,
    transition: `background-color ${theme.transitions.hover}, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s`,

    display: 'inline-flex',
    alignItems: 'center',

    cursor: 'pointer',
    '&:disabled': {
      cursor: 'default',
    },

    '&:focus-visible': {
      boxShadow: theme.shadow.focus,
    },
  },
  ({ justifyContent = 'center' }) => ({ justifyContent }),
  ({ size = 'medium' }) => getButtonSizeStyles(size),
  ({ fullWidth }) => fullWidth && { width: '100%' },
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

const DangerButton = styled(StyledButton)(
  {
    backgroundColor: theme.colors.signalRedFill,
    color: theme.colors.signalRedText,

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.signalRedHighlight,
      },
    },

    ':active': {
      backgroundColor: theme.colors.signalRedHighlight,
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
