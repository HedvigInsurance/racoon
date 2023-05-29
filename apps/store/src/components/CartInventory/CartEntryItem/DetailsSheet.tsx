import styled from '@emotion/styled'
import type { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import { Heading, Text } from 'ui'
import { Space, theme } from 'ui'
import { useAutoFormat } from '@/utils/useFormatter'
import { CartEntry } from '../CartInventory.types'
import { DataTableRow, getDataTable } from '../DataTable/DataTable'

export const DetailsSheet = (props: CartEntry) => {
  const { documents, productName, data } = props
  const { t } = useTranslation('cart')
  const dataTableRows = getDataTable(productName)
  const getDataTableValue = useGetDataTableValue()

  const allRows =
    dataTableRows?.map((item) => ({
      title: t(item.label, { defaultValue: `${item.label} MISSING` }),
      value: getDataTableValue(item, data),
    })) ?? []
  const rowsWithValues = allRows.filter((item) => item.value !== null)

  return (
    <Root y={1}>
      <Table>
        {rowsWithValues.map(({ title, value }) => (
          <Row key={title}>
            <Text color="textSecondary">{title}</Text>
            <Text>{value}</Text>
          </Row>
        ))}
        {props.tierLevelDisplayName && (
          <Row>
            <Text color="textSecondary">{t('DATA_TABLE_TIER_LABEL')}</Text>
            <Text>{props.tierLevelDisplayName}</Text>
          </Row>
        )}
        {props.deductibleDisplayName && (
          <Row>
            <Text color="textSecondary">{t('DATA_TABLE_DEDUCTIBLE_LABEL')}</Text>
            <Text>{props.deductibleDisplayName}</Text>
          </Row>
        )}
      </Table>

      <div>
        <Heading as="h4" color="textPrimary" mb={theme.space.md} variant="standard.18">
          {t('DOCUMENTS')}
        </Heading>
        {documents.map((item) => (
          <Row key={item.url}>
            <DocumentLink href={item.url} target="_blank" rel="noopener noreferrer">
              {item.displayName}
              <Sup> PDF</Sup>
            </DocumentLink>
          </Row>
        ))}
      </div>
    </Root>
  )
}

const useGetDataTableValue = () => {
  const { t } = useTranslation('cart')
  const autoFormat = useAutoFormat()

  return (row: DataTableRow, data: CartEntry['data']) => {
    const value = data[row.key]

    switch (row.type) {
      case 'AREA':
        if (typeof value === 'number') {
          return t('DATA_TABLE_LIVING_SPACE_VALUE', { area: value })
        } else return null

      case 'HOUSEHOLD_SIZE':
        return formatHouseholdSize(t, data)

      case 'MILEAGE':
        if (value) {
          return t('DATA_TABLE_MILEAGE_VALUE', { value: value })
        } else return null

      case 'CAT_GENDER':
        if (value === 'MALE') {
          return t('DATA_TABLE_CAT_GENDER_VALUE_MALE')
        } else return t('DATA_TABLE_CAT_GENDER_VALUE_FEMALE')

      case 'DOG_GENDER':
        if (value === 'MALE') {
          return t('DATA_TABLE_DOG_GENDER_VALUE_MALE')
        } else return t('DATA_TABLE_DOG_GENDER_VALUE_FEMALE')

      case 'LIST':
        return formatList(value)

      default:
        return autoFormat(row.key, value)
    }
  }
}

const formatHouseholdSize = (
  t: TFunction<'cart', undefined, 'cart'>,
  data: Record<string, unknown>,
) => {
  const count = parseInt(String(data['numberCoInsured']), 10)
  if (isNaN(count)) return null
  return t('DATA_TABLE_HOUSEHOLD_SIZE_VALUE', { count: count + 1 })
}

const formatList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  } else return null
}

const Root = styled(Space)({
  paddingTop: theme.space.md,
})

const Table = styled.div({})

const Row = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const DocumentLink = styled.a({
  lineHeight: '1.6',
  '&:hover': {
    color: theme.colors.gray900,
  },
})

const Sup = styled.sup({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
