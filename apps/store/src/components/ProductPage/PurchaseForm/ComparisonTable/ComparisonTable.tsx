import styled from '@emotion/styled'
import { Text, CheckIcon as PerilsCheckIcon, MinusIcon, theme, mq } from 'ui'

export const Root = styled.table({
  width: '100%',
  borderCollapse: 'collapse',
})

export const Head = styled.thead({})
export const Body = styled.tbody({})

export const Row = styled.tr({
  ':not(:last-child)': {
    borderBottom: '1px solid hsla(0, 0%, 7%, 0.1)',
  },

  ':last-child': {
    td: {
      borderBottomLeftRadius: theme.radius.xs,
      borderBottomRightRadius: theme.radius.xs,
    },
  },
})

type HeaderProps = { children?: React.ReactNode; className?: string; active?: boolean }

export const Header = ({ children, active, ...props }: HeaderProps) => {
  if (!children) return <TableHeader {...props} />

  const Component = active ? ActiveTableHeader : TableHeader
  return (
    <Component {...props}>
      <Text size="xs" color="textSecondary" align="center">
        {children}
      </Text>
    </Component>
  )
}

const TableHeader = styled.th({
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.xs,

  [mq.lg]: {
    paddingBlock: theme.space.md,
    paddingInline: theme.space.sm,
  },
})

const ActiveTableHeader = styled(TableHeader)({
  backgroundColor: theme.colors.green100,
  borderTopLeftRadius: theme.radius.xs,
  borderTopRightRadius: theme.radius.xs,
})

type TitleDataCellProps = { children: React.ReactNode; className?: string }

export const TitleDataCell = ({ children, ...props }: TitleDataCellProps) => {
  return (
    <StyledTitleDataCell {...props}>
      <Text size={{ _: 'sm', lg: 'md' }}>{children}</Text>
    </StyledTitleDataCell>
  )
}

type DataCellProps = { children: React.ReactNode; className?: string; active?: boolean }

export const DataCell = ({ children, active, ...props }: DataCellProps) => {
  const Component = active ? ActiveTableDataCell : TableDataCell
  return (
    <Component {...props}>
      <Centered>{children}</Centered>
    </Component>
  )
}

const TableDataCell = styled.td({
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.xs,
  verticalAlign: 'middle',
  minWidth: '2.5rem',

  [mq.lg]: {
    minWidth: '4rem',
    paddingBlock: theme.space.md,
    paddingInline: theme.space.sm,
  },
})

const StyledTitleDataCell = styled(TableDataCell)({
  minWidth: 'revert',
  paddingInline: 0,

  [mq.lg]: {
    paddingInline: 0,
  },
})

const ActiveTableDataCell = styled(TableDataCell)({
  backgroundColor: theme.colors.green100,
})

const Centered = styled.div({
  display: 'flex',
  justifyContent: 'center',
  // Make sure text gets centered when wrapped into multiple lines
  textAlign: 'center',
})

export const CheckIcon = () => <PerilsCheckIcon size="1rem" />

export const MissingIcon = () => {
  return <MinusIcon size="1.25rem" color={theme.colors.gray500} />
}
