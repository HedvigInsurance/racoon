import { Button, Heading, Space } from 'ui'

import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'

const TABLE = [
  {
    title: 'Name',
    value: 'Magnus Berg',
  },
  {
    title: 'Antal försäkrade',
    value: '1 person',
  },
  {
    title: 'Gatuadress',
    value: 'Vagnvägen 4, 175 56, Älvsjö',
  },
  {
    title: 'Kvadratmeter',
    value: '100 m2',
  },
]

const Wrapper = styled(Space)({
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
})

const Table = styled.div({})

const Row = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '2.25rem',
})

const TableTitle = styled.p(({ theme }) => ({
  margin: 0,
  color: theme.colors.gray900,
  fontSize: '1rem',
}))

const TableValue = styled.p(({ theme }) => ({
  margin: 0,
  color: theme.colors.gray700,
  fontSize: '1rem',
}))

export const YourInformation = () => {
  const { t } = useTranslation()

  return (
    <Wrapper y={1}>
      <Heading headingLevel="h3" variant="xs" colorVariant="dark">
        {t('DETAILS_MODULE_HEADLINE')}
      </Heading>

      <Table>
        {TABLE.map((row) => (
          <Row key={row.title}>
            <TableTitle>{row.title}</TableTitle>
            <TableValue>{row.value}</TableValue>
          </Row>
        ))}
      </Table>

      <Button $variant="outlined">{t('CHECKOUT_EDIT_INFORMATION_BUTTON')}</Button>
    </Wrapper>
  )
}
