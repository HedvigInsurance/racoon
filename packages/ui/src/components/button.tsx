import styled from '@emotion/styled'

type ButtonProps = {
  $loading?: boolean
}

export const Button = styled.button<ButtonProps>(({ theme, $loading }) => ({
  appearance: 'none',
  border: 0,
  color: theme.colors.gray900,
  backgroundColor: theme.colors.purple500,
  borderRadius: '0.5rem',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  cursor: 'pointer',
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
