import styled from '@emotion/styled'

type ButtonProps = {
  $loading?: boolean
  $disabled?: boolean
  $variant?: 'filled' | 'outlined' | 'text'
}

export const UnstyledButton = styled.button<Pick<ButtonProps, '$disabled'>>(({ $disabled }) => ({
  padding: 0,
  margin: 0,
  background: 'none',
  border: 'none',
  outline: 'none',
  appearance: 'none',
  cursor: $disabled ? 'default' : 'pointer',
}))

export const Button = styled(UnstyledButton)<ButtonProps>(({ theme, $loading, $variant }) => ({
  color: theme.colors.gray900,
  backgroundColor: theme.colors.purple500,
  borderRadius: '0.5rem',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  width: '100%',

  opacity: $loading ? 0.5 : 1,

  ':hover': {
    backgroundColor: theme.colors.purple800,
  },

  ':disabled': {
    color: theme.colors.gray500,
    backgroundColor: theme.colors.gray300,
  },
}))

export const LinkButton = styled(Button)<{ href: string }>({
  textDecoration: 'none',
  textAlign: 'center',
})
LinkButton.defaultProps = { as: 'a' }
