import styled from '@emotion/styled'
import React from 'react'
import { ReactNode } from 'react'
import { getMargins, Margins } from '../../lib/margins'
import { getColor } from '../../lib/theme'

export type ButtonVariant = 'filled' | 'outlined' | 'text'
export type ButtonSize = 'xs' | 'sm' | 'lg'

export type ButtonColors = 'dark' | 'light' | 'lavender'

export type ButtonProps = Margins & {
  variant?: ButtonVariant
  fullWidth?: boolean
  color?: ButtonColors
  size?: ButtonSize
  children?: ReactNode
  icon?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
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
  ':disabled': {
    cursor: 'default',
  },
})

const paddingsForSize: Record<ButtonSize, string> = {
  xs: '0.375rem 0.375rem',
  sm: '0.375rem 0.75rem',
  lg: '0.75rem 2rem',
}

const iconSizes = {
  xs: '1rem',
  sm: '1rem',
  lg: '1.5rem',
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
    alignItems: 'center',
    whiteSpace: 'nowrap',

    ':focus': {
      outline: `5px auto ${theme.colors.purple700}`,
    },

    ...getMargins(props),

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
      color: theme.colors.gray900,
      borderColor: theme.colors.gray900,
      ':hover, :focus': {
        color: theme.colors.gray700,
        borderColor: theme.colors.gray700,
      },
      ':disabled': {
        color: theme.colors.gray500,
        borderColor: theme.colors.gray500,
      },
    }),

    ...(variant === 'text' && {
      backgroundColor: 'transparent',
      color: getColor(color),
      border: 'none',
      ':disabled': {
        color: theme.colors.gray500,
      },
    }),
  }),
)

export const Button = ({ children, icon, ...rest }: ButtonProps) => {
  const sizedIcon = React.Children.map(icon, (child) =>
    React.cloneElement(child as React.ReactElement<any>, {
      size: iconSizes[rest.size || 'lg'],
    }),
  )

  return (
    <ButtonElement {...rest}>
      {children}
      {icon && <IconWrapper padded={Boolean(children)}>{sizedIcon}</IconWrapper>}
    </ButtonElement>
  )
}

type LinkButtonProps = ButtonProps & {
  href?: string
  as?: string
}

export const LinkButton = styled(ButtonElement)<LinkButtonProps>(({ as }: LinkButtonProps) => ({
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  cursor: as === 'span' ? 'default' : 'pointer',
}))
LinkButton.defaultProps = { as: 'a' }
