import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type CustomProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'ghost'
  size?: 'large' | 'medium' | 'small'
  loading?: boolean
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomProps

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { variant = 'primary', loading, children, ...baseProps } = props

  const theme = useTheme()
  const buttonChildren = loading ? (
    <Centered>
      <LoadingSpinner size={props.size === 'small' ? theme.fontSizes[1] : theme.fontSizes[2]} />
    </Centered>
  ) : (
    children
  )

  const buttonProps = { ...baseProps, children: buttonChildren }

  switch (variant) {
    case 'primary':
      return <PrimaryButton ref={ref} {...buttonProps} />
    case 'primary-alt':
      return <PrimaryAltButton ref={ref} {...buttonProps} />
    case 'secondary':
      return <SecondaryButton ref={ref} {...buttonProps} />
    case 'ghost':
      return <GhostButton ref={ref} {...buttonProps} />
  }
})
Button.displayName = 'Button'

const Centered = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const StyledButton = styled.button<CustomProps>(({ theme, size = 'large' }) => ({
  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',

  borderRadius: theme.radius.sm,

  whiteSpace: 'nowrap',
  lineHeight: 1,
  transition:
    'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',

  ...(size === 'large' && {
    width: '100%',
    paddingInline: theme.space[6],
    paddingBlock: theme.space[3],

    textAlign: 'center',
    fontSize: theme.fontSizes[3],
  }),

  ...(size === 'medium' && {
    paddingInline: theme.space[4],
    paddingBlock: theme.space[2],
    fontSize: theme.fontSizes[3],
  }),

  ...(size === 'small' && {
    paddingInline: theme.space[4],
    paddingBlock: theme.space[2],
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

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.colors.gray1000,
  color: theme.colors.textNegative,

  '&:hover': {
    // TODO: update to use translucent gray900
    backgroundColor: theme.colors.gray900,
  },

  '&:disabled': {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textDisabled,
  },

  '&:focus-visible': {
    backgroundColor: theme.colors.gray900,
  },
}))

const shadow = css({
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(30px)',
})

const PrimaryAltButton = styled(StyledButton)(
  ({ theme }) => ({
    backgroundColor: theme.colors.green50,
    color: theme.colors.textPrimary,

    '&:hover': {
      backgroundColor: theme.colors.green100,
    },

    '&:disabled': {
      backgroundColor: theme.colors.gray200,
      color: theme.colors.textDisabled,
      boxShadow: 'none',
      backdropFilter: 'none',
    },
  }),
  shadow,
)

const SecondaryButton = styled(StyledButton)(
  ({ theme }) => ({
    // TODO: update to use translucent gray100
    backgroundColor: theme.colors.gray100,
    color: theme.colors.textPrimary,

    '&:hover': {
      // TODO: update to use translucent gray200
      backgroundColor: theme.colors.gray200,
    },

    '&:disabled': {
      backgroundColor: theme.colors.gray200,
      color: theme.colors.textDisabled,
      boxShadow: 'none',
      backdropFilter: 'none',
    },
  }),
  shadow,
)

const GhostButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.colors.textPrimary,

  '&:hover': {
    // TODO: update to use translucent gray100
    backgroundColor: theme.colors.gray100,
  },

  '&:disabled': {
    color: theme.colors.textDisabled,
    backgroundColor: 'transparent',
  },
}))
