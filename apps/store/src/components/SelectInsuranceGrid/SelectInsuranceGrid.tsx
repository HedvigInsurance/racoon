import styled from '@emotion/styled'
import { Children } from 'react'
import { mq, theme } from 'ui'

const ITEM_THRESHOLD = 4
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
  '--column-width': '21rem',
  '--max-no-columns': 3,
  '--grid-gap': '1rem',

  '--gap-count': 'calc(var(--max-no-columns) - 1)',
  '--gap-width': 'calc(var(--gap-count) * var(--grid-gap))',

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, var(--column-width))',
    justifyContent: 'center',
    maxWidth: 'calc((var(--max-no-columns) * var(--column-width)) + var(--gap-width))',
    marginInline: 'auto',

    [`&[data-layout=${LAYOUT.COLUMN}]`]: {
      gridTemplateColumns: 'var(--column-width)',
    },
  },
})
