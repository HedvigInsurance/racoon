import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'
import { DataTableRow, getDataTable } from './DataTable/DataTable'
import * as DetailsSheet from './DetailsSheet'

type Props = CartEntry & {
  children: React.ReactNode
}

export const DetailsSheetDialog = (props: Props) => {
  const { children, pillow, title, cost, documents, productName, data, startDate } = props
  const { t } = useTranslation('cart')
  const formatter = useFormatter()
  const dataTableRows = getDataTable(productName)
  const getDataTableValue = useGetDataTableValue()

  return (
    <FullscreenDialog.Root>
      {children}

      <FullscreenDialog.Modal
        Footer={
          <FullscreenDialog.Close asChild>
            <Button type="button">{t('DETAILS_SHEET_DISMISS_BUTTON')}</Button>
          </FullscreenDialog.Close>
        }
      >
        <DetailsSheet.Root y={1.5}>
          <DetailsSheet.Header>
            <Pillow size="large" {...pillow} />
            <div>
              <Text align="center">{title}</Text>
              <Text color="textSecondary" align="center">
                {formatter.monthlyPrice(cost)}
              </Text>
            </div>
          </DetailsSheet.Header>
          <DetailsSheet.Main>
            <DetailsSheet.Table>
              <DetailsSheet.Row>
                <Text color="textSecondary">{t('DATA_TABLE_START_DATE_LABEL')}</Text>
                <Text>
                  {startDate ? (
                    <Capitalize>{formatter.fromNow(startDate)}</Capitalize>
                  ) : (
                    t('DATA_TABLE_START_DATE_AUTO_SWITCH')
                  )}
                </Text>
              </DetailsSheet.Row>
              {dataTableRows?.map((item) => (
                <DetailsSheet.Row key={item.label}>
                  <Text color="textSecondary">
                    {t(item.label, { defaultValue: `${item.label} MISSING` })}
                  </Text>
                  <Text>{getDataTableValue(item, data)}</Text>
                </DetailsSheet.Row>
              ))}
            </DetailsSheet.Table>

            <DetailsSheet.HorizontalList>
              {documents.map((item) => (
                <Button
                  key={item.url}
                  size="small"
                  variant="secondary"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.displayName}
                </Button>
              ))}
            </DetailsSheet.HorizontalList>
          </DetailsSheet.Main>
        </DetailsSheet.Root>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const Capitalize = styled.span({ textTransform: 'capitalize' })

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
        if (typeof data['numberCoInsured'] === 'number') {
          return t('DATA_TABLE_HOUSEHOLD_SIZE_VALUE', { count: data['numberCoInsured'] + 1 })
        } else return null

      case 'MILEAGE':
        if (typeof data['mileage'] === 'number') {
          return t('DATA_TABLE_MILEAGE_VALUE', { value: data['mileage'] })
        } else return null

      default:
        return null
    }
  }
}
