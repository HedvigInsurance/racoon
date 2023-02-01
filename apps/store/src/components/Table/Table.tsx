import styled from '@emotion/styled'
import { theme } from 'ui'

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

export const Cell = styled.td<CellProps>(({ align = 'left' }) => ({
  padding: theme.space.xs,
  border: `1px solid ${theme.colors.gray500}`,

  textAlign: align,
}))
