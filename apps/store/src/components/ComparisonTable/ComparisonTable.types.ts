export const TableMarkers = {
  EmptyHeader: '',
  Covered: '[*]',
  NotCovered: '[]',
} as const

type RowTitle = { title: string; description?: string }

type Row = [RowTitle, ...Array<string>]

export type Head = Array<string>

export type Body = Array<Row>

export type Table = {
  head: Head
  body: Body
}
