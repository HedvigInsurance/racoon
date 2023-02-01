import styled from '@emotion/styled'
import { theme } from 'ui'

const HEIGHT = '20rem'

export type StatisticProps = {
  badge: string
  value: string
  label: string
}

export const Root = styled.div({
  padding: theme.space[5],
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.gray200,
  minHeight: HEIGHT,

  display: 'grid',
  rowGap: theme.space[3],
  justifyItems: 'flex-start',
  gridTemplateRows: 'auto auto 1fr',
  gridTemplateAreas: `
    'badge'
    'description'
    'value'
  `,
})

export const Description = styled.p({
  gridArea: 'description',

  fontSize: theme.fontSizes[3],
})

export const Value = styled.p({
  gridArea: 'value',
  alignSelf: 'flex-end',

  color: theme.colors.black,
  fontSize: theme.fontSizes[6],
})
