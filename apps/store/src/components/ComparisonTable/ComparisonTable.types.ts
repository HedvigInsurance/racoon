export const TableMarkers = {
  EmptyHeader: '',
  Covered: '[*]',
  NotCovered: '[]',
} as const

type Row = Array<string | typeof TableMarkers.Covered | typeof TableMarkers.NotCovered>

export type Head = Array<string | typeof TableMarkers.EmptyHeader>

export type Body = Array<Row>

export type Table = {
  head: Head
  body: Body
}
