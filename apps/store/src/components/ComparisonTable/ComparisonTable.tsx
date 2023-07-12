import styled from '@emotion/styled'
import {
  Text,
  CheckIcon as PerilsCheckIcon,
  type CheckIconProps as PerilsCheckIconProps,
  MinusIcon,
  type MinusIconProps,
  theme,
  mq,
} from 'ui'

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
      borderBottomLeftRadius: theme.radius.xxs,
      borderBottomRightRadius: theme.radius.xxs,
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
  borderTopLeftRadius: theme.radius.xxs,
  borderTopRightRadius: theme.radius.xxs,
})

type TitleDataCellProps = { children: React.ReactNode; className?: string }

export const TitleDataCell = ({ children, ...props }: TitleDataCellProps) => {
  return (
    <StyledTitleDataCell {...props}>
      <Text size={{ _: 'sm', lg: 'md' }}>{children}</Text>
    </StyledTitleDataCell>
  )
}

type DataCellProps = {
  children: React.ReactNode
  alignment?: 'left' | 'center' | 'right'
  className?: string
  active?: boolean
}

export const DataCell = ({ children, active, alignment = 'center', ...props }: DataCellProps) => {
  const Component = active ? ActiveTableDataCell : TableDataCell
  return (
    <Component {...props}>
      <Aligned data-alignment={alignment}>{children}</Aligned>
    </Component>
  )
}

const TableDataCell = styled.td({
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.xs,
  verticalAlign: 'middle',
  minWidth: '2.5rem',
  color: theme.colors.textSecondary,

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

const Aligned = styled.div({
  display: 'flex',

  '&[data-alignment="left"]': {
    justifyContent: 'flex-start',
  },

  '&[data-alignment="center"]': {
    justifyContent: 'center',
    // Make sure text gets centered when wrapped into multiple lines
    textAlign: 'center',
  },

  '&[data-alignment="right"]': {
    justifyContent: 'flex-end',
  },
})

export const CheckIcon = (props: PerilsCheckIconProps) => <PerilsCheckIcon size="1rem" {...props} />

export const MissingIcon = (props: MinusIconProps) => {
  return <MinusIcon size="1.25rem" color={theme.colors.gray500} {...props} />
}
