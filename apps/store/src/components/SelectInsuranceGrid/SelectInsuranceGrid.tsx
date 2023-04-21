import styled from '@emotion/styled'
import { Children } from 'react'
import { mq, theme } from 'ui'

const ITEM_THRESHOLD = 4
const COLUMN_WIDTH = '21rem'
const LAYOUT = { GRID: 'grid', COLUMN: 'column' }

type Props = {
  children: React.ReactNode
}

export const SelectInsuranceGrid = ({ children }: Props) => {
  return (
    <Grid data-layout={Children.count(children) > ITEM_THRESHOLD ? LAYOUT.GRID : LAYOUT.COLUMN}>
      {children}
    </Grid>
  )
}

const Grid = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, ${COLUMN_WIDTH})`,
    justifyContent: 'center',

    [`&[data-layout=${LAYOUT.COLUMN}]`]: {
      gridTemplateColumns: COLUMN_WIDTH,
    },
  },
})
