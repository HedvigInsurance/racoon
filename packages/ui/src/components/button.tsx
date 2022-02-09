import { colorsV3 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

type ButtonProps = {
  $loading?: boolean
}

export const Button = styled.button<ButtonProps>(
  {
    appearance: 'none',
    border: 0,
    color: colorsV3.gray900,
    backgroundColor: colorsV3.purple500,
    borderRadius: '0.5rem',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    cursor: 'pointer',

    ':hover': {
      backgroundColor: colorsV3.purple800,
    },

    ':disabled': {
      color: colorsV3.gray500,
      backgroundColor: colorsV3.gray300,
    },
  },
  ({ $loading }) => ({
    opacity: $loading ? 0.5 : 1,
  }),
)

export const LinkButton = styled(Button)<{ href: string }>({
  textDecoration: 'none',
})
LinkButton.defaultProps = { as: 'a' }
