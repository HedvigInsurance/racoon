import styled from '@emotion/styled'
import { mq, Space } from 'ui'

export const ContentWrapper = styled(Space)({
  '--padding-x': '1rem',
  padding: 'var(--padding-x)',
  width: '100%',
  maxWidth: 'calc(30rem + var(--padding-x) * 2)',
  margin: '0 auto',
  boxSizing: 'border-box',

  [mq.md]: {
    minHeight: 'initial',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },

  [mq.lg]: {
    '--padding-x': '2rem',
  },

  [mq.xl]: {
    paddingTop: '6rem',
  },
})
