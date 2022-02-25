import { Button, Heading, Space } from 'ui'
import { Table } from '../types'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'

const Wrapper = styled(Space)({
  padding: '0.75rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
})

const Table = styled.div({})

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 0',
  ':not(&:last-of-type)': {
    borderBottom: `1px solid ${theme.colors.gray300}`
  }
}))

const TableTitle = styled.p(({ theme }) => ({
  margin: 0,
  color: theme.colors.gray700,
  fontSize: '0.875rem',
}))

const TableValue = styled.p(({ theme }) => ({
  margin: 0,
  color: theme.colors.gray900,
  fontSize: '0.875rem',
  textAlign: 'right',
  whiteSpace: 'pre-line'
}))

type Props = { table: Table }

export const YourInformation = ({ table }: Props) => {
  const { t } = useTranslation()

  return (
    <Wrapper y={0.5}>
      <Heading headingLevel="h3" variant="xs" colorVariant="dark">
        {t('DETAILS_MODULE_HEADLINE')}
      </Heading>

      <Table>
        {table.rows.map((row) => (
          <Row key={row.title}>
            <TableTitle>{t(row.title)}</TableTitle>
            <TableValue>
              {row.value.type === 'text' ? row.value.text : t(row.value.key, row.value.variables)}
            </TableValue>
          </Row>
        ))}
      </Table>

      <Button $variant="outlined">{t('CHECKOUT_EDIT_INFORMATION_BUTTON')}</Button>
    </Wrapper>
  )
}
