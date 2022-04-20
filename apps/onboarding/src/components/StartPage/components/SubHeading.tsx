import styled from '@emotion/styled'
import { mq } from 'ui'

export const SubHeading = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
  margin: 0,
  display: 'none',

  [mq.lg]: {
    display: 'block',
  },
}))
