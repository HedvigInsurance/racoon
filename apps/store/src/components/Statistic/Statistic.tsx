import styled from '@emotion/styled'
import { theme } from 'ui'

const HEIGHT = '20rem'

export type StatisticProps = {
  badge: string
  value: string
  label: string
}

export const Root = styled.div({
  padding: theme.space.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.gray200,
  minHeight: HEIGHT,

  display: 'grid',
  rowGap: theme.space.sm,
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
