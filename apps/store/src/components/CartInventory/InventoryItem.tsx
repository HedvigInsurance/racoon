import styled from '@emotion/styled'
import { theme } from 'ui'

export const Root = styled.div({
  display: 'grid',
  columnGap: theme.space[4],
  rowGap: theme.space[1],
  alignItems: 'center',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: `
    'left  main'
    'empty bottom'
  `,
})

export const Left = styled.div({
  gridArea: 'left',
})

export const Main = styled.div({
  gridArea: 'main',

  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',
  columnGap: theme.space[4],
  rowGap: theme.space[1],
  gridTemplateAreas: `
    'main-left   main-right'
    'main-bottom main-bottom'
  `,
})

export const MainLeft = styled.div({
  gridArea: 'main-left',
})

export const MainRight = styled.div({
  gridArea: 'main-right',
})

export const MainBottom = styled.div({
  gridArea: 'main-bottom',
})

export const Bottom = styled.div({
  gridArea: 'bottom',
})
