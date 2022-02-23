import styled from '@emotion/styled'

export type ButtonProps = {
  $variant?: 'filled' | 'outlined' | 'text'
  $hasFullWidth?: boolean
  $color?: 'dark' | 'lavender'
}

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

export const Button = styled(UnstyledButton)<ButtonProps>(
  ({ theme, $variant = 'filled', $hasFullWidth, $color }) => ({
    width: $hasFullWidth ? '100%' : 'auto',
    padding: '0.75rem 2rem',
    fontFamily: theme.fonts.body,
    fontSize: '1rem',
    fontFamily: theme.fonts.body,
    lineHeight: '1.5rem',
    border: '1px solid',
    borderRadius: '0.5rem',
    maxWidth: '100%',

    ...($variant === 'filled' && {
      backgroundColor: $color === 'lavender' ? theme.colors.purple500 : theme.colors.gray900,
      color: $color === 'lavender' ? theme.colors.gray900 : theme.colors.gray100,
      borderColor: $color === 'lavender' ? theme.colors.purple500 : theme.colors.gray900,
      ':hover, :focus': {
        backgroundColor: $color === 'lavender' ? theme.colors.purple800 : theme.colors.gray800,
      },
      ':disabled': {
        color: theme.colors.gray500,
        backgroundColor: theme.colors.gray300,
        borderColor: theme.colors.gray300,
      },
    }),

    ...($variant === 'outlined' && {
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

    ...($variant === 'text' && {
      padding: 0,
      backgroundColor: 'transparent',
      color: $color === 'lavender' ? theme.colors.purple900 : theme.colors.gray900,
      border: 'none',
      ':disabled': {
        color: theme.colors.gray500,
      },
    }),
  }),
)

export const LinkButton = styled(Button)<{ href: string }>({
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
})
LinkButton.defaultProps = { as: 'a' }
