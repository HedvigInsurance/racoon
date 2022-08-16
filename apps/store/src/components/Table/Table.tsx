import styled from '@emotion/styled'

type TableProps = { layout?: 'fixed' | 'auto' }

export const Root = styled.table<TableProps>(({ layout }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: layout,
}))

export const Head = styled.thead({})

export const Body = styled.tbody({})

export const Row = styled.tr({})

type CellProps = { align?: 'left' | 'right' | 'center' }

export const Cell = styled.td<CellProps>(({ theme, align = 'left' }) => ({
  padding: theme.space[2],
  border: `1px solid ${theme.colors.gray500}`,

  textAlign: align,
}))
