import styled from '@emotion/styled'
import type { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import { Heading, Text } from 'ui'
import { Space, theme } from 'ui'
import { CartEntry } from '../CartInventory.types'
import { DataTableRow, getDataTable } from '../DataTable/DataTable'

export const DetailsSheet = (props: CartEntry) => {
  const { documents, productName, data } = props
  const { t } = useTranslation('cart')
  const dataTableRows = getDataTable(productName)
  const getDataTableValue = useGetDataTableValue()

  return (
    <Root y={1}>
      <Table>
        {dataTableRows?.map((item) => (
          <Row key={item.label}>
            <Text color="textSecondary">
              {t(item.label, { defaultValue: `${item.label} MISSING` })}
            </Text>
            <Text>{getDataTableValue(item, data)}</Text>
          </Row>
        ))}
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

  return (row: DataTableRow, data: CartEntry['data']) => {
    switch (row.type) {
      case 'STRING':
        return (data[row.key] as string | number | undefined) ?? null

      case 'AREA':
        if (typeof data[row.key] === 'number') {
          return t('DATA_TABLE_LIVING_SPACE_VALUE', { area: data[row.key] })
        } else return null

      case 'HOUSEHOLD_SIZE':
        return formatHouseholdSize(t, data)

      case 'MILEAGE':
        if (data['mileage']) {
          return t('DATA_TABLE_MILEAGE_VALUE', { value: data['mileage'] })
        } else return null

      case 'CAT_GENDER':
        if (data[row.key] === 'MALE') {
          return t('DATA_TABLE_CAT_GENDER_VALUE_MALE')
        } else return t('DATA_TABLE_CAT_GENDER_VALUE_FEMALE')

      case 'DOG_GENDER':
        if (data[row.key] === 'MALE') {
          return t('DATA_TABLE_DOG_GENDER_VALUE_MALE')
        } else return t('DATA_TABLE_DOG_GENDER_VALUE_FEMALE')

      case 'LIST':
        return formatList(data[row.key])

      default:
        return null
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
