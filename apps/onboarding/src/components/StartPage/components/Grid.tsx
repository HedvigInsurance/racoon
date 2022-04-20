import styled from '@emotion/styled'
import { mq } from 'ui'

export const Grid = styled.div({
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: '100vh',
  },
})

export const Col = styled.div({
  [mq.lg]: {
    gridColumn: '2',
    width: '50vw',
  },
})
