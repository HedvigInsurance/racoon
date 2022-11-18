import styled from '@emotion/styled'

const HEIGHT = '20rem'

export type StatisticProps = {
  badge: string
  value: string
  label: string
}

export const Root = styled.div(({ theme }) => ({
  padding: theme.space[5],
  borderRadius: 8,
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
}))

export const Badge = styled.span(({ theme }) => ({
  gridArea: 'badge',

  fontSize: theme.fontSizes[1],
  backgroundColor: theme.colors.purple300,
  padding: theme.space[2],
  borderRadius: 8,
}))

export const Description = styled.p(({ theme }) => ({
  gridArea: 'description',

  fontSize: theme.fontSizes[3],
}))

export const Value = styled.p(({ theme }) => ({
  gridArea: 'value',
  alignSelf: 'flex-end',

  color: theme.colors.black,
  fontSize: theme.fontSizes[6],
}))
