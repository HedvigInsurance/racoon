type TableText =
  | { type: 'text'; text: string }
  | { type: 'translation'; key: string; variables: { [key: string]: string } }

type TableRow = {
  title: string
  value: TableText
}

export type Table = {
  rows: Array<TableRow>
}
