import styled from '@emotion/styled'

export const CaptionText = styled.div(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray500,
  fontSize: '0.875rem',
  textAlign: 'center',
  maxWidth: '24rem',
  margin: '0 auto',

  a: {
    color: theme.colors.gray500,
    textDecoration: 'underline',
  },
}))
