import styled from '@emotion/styled'
import { ElementType, forwardRef } from 'react'
import { ReactNode } from 'react'
import { getMargins, Margins } from '../../lib/margins'
import { getPaddings, Paddings } from '../../lib/paddings'
import { getColor } from '../../lib/theme/theme'

export type ButtonVariant = 'filled' | 'outlined' | 'text'
export type ButtonSize = 'sm' | 'lg'

export type ButtonColors = 'dark' | 'light' | 'lavender'

export type ButtonProps = Paddings &
  Margins & {
    variant?: ButtonVariant
    fullWidth?: boolean
    color?: ButtonColors
    size?: ButtonSize
    children?: ReactNode
    icon?: ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    disabled?: boolean
    form?: string
  }

type IconWrapperProps = {
  padded?: boolean
}

const IconWrapper = styled.div<IconWrapperProps>(({ padded }) => ({
  marginLeft: padded ? '0.5rem' : 0,
  display: 'flex',
}))

export const UnstyledButton = styled.button({
  padding: 0,
  margin: 0,
  background: 'none',
  border: 'none',
  outline: 'none',
  appearance: 'none',
  cursor: 'pointer',

  // opt out of double tap to zoom to immediately respond to taps
  touchAction: 'manipulation',

  '&:disabled': {
    cursor: 'default',
  },
})

const paddingsForSize: Record<ButtonSize, string> = {
  sm: '0.375rem 0.75rem',
  lg: '0.75rem 2rem',
}

const ButtonElement = styled(UnstyledButton)<ButtonProps>(
  ({ theme, variant = 'filled', fullWidth, color, size = 'lg', ...props }) => ({
    width: fullWidth ? '100%' : 'auto',
    padding: paddingsForSize[size],
    lineHeight: size === 'lg' ? '1.5rem' : '1rem',
    fontFamily: theme.fonts.body,
    fontSize: '1rem',
    fontWeight: 400,
    border: '1px solid',
    maxWidth: '100%',
    transition: 'all ease-out 200ms',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap',

    ':focus': {
      outline: `5px auto ${theme.colors.purple700}`,
    },

    ...((variant === 'filled' || variant === 'outlined') && {
      borderRadius: size === 'lg' ? '0.5rem' : '0.375rem',
    }),
    ...(variant === 'filled' && {
      backgroundColor: color === 'lavender' ? theme.colors.purple500 : theme.colors.gray900,
      color: color === 'lavender' ? theme.colors.gray900 : theme.colors.gray100,
      borderColor: color === 'lavender' ? theme.colors.purple500 : theme.colors.gray900,

      ':hover, :focus': {
        backgroundColor: color === 'lavender' ? theme.colors.purple800 : theme.colors.gray800,
      },
      ':disabled': {
        color: theme.colors.gray500,
        backgroundColor: theme.colors.gray300,
        borderColor: theme.colors.gray300,
      },
    }),

    ...(variant === 'outlined' && {
      backgroundColor: 'transparent',
      color: color ? getColor(color) : theme.colors.gray900,
      borderColor: color ? getColor(color) : theme.colors.gray900,
      ':hover, :focus': {
        color: color ? getColor(color) : theme.colors.gray700,
        borderColor: color ? getColor(color) : theme.colors.gray700,
      },
      ':disabled': {
        color: theme.colors.gray500,
        borderColor: theme.colors.gray500,
      },
    }),

    ...(variant === 'text' && {
      backgroundColor: 'transparent',
      color: color ? getColor(color) : 'currentcolor',
      border: 'none',
      ':disabled': {
        color: theme.colors.gray500,
      },
    }),

    ...getMargins(props),
    ...getPaddings(props),
  }),
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, icon, ...rest }, ref) => {
    return (
      <ButtonElement ref={ref} {...rest}>
        {children}
        {icon && <IconWrapper padded={Boolean(children)}>{icon}</IconWrapper>}
      </ButtonElement>
    )
  },
)

export type LinkButtonProps = ButtonProps & {
  href?: string
  as?: ElementType
}

export const LinkButton = styled(ButtonElement)<LinkButtonProps>(({ as }: LinkButtonProps) => ({
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  cursor: as === 'span' ? 'default' : 'pointer',
}))
LinkButton.defaultProps = { as: 'a' }
