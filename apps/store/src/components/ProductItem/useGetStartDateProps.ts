import { useTranslation } from 'next-i18next'
import { type ComponentProps, useCallback } from 'react'
import { useFormatter } from '@/utils/useFormatter'
import { type ProductItem } from './ProductItem'

type Params = {
  productName: string
  data: Record<string, unknown>
  startDate?: string
}

type StartDateProps = ComponentProps<typeof ProductItem>['startDate']

type GetStartDateProps = (params: Params) => StartDateProps

export const useGetStartDateProps = (): GetStartDateProps => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return useCallback(
    (params) => {
      const content: Array<string> = []

      const productBasedSummary = getProductBasedSummary(params.productName, params.data)
      if (productBasedSummary) {
        content.push(productBasedSummary)
      }

      content.push(
        params.startDate
          ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(new Date(params.startDate)) })
          : t('CART_ENTRY_AUTO_SWITCH'),
      )

      return {
        label: content.join(' • '),
        tooltip: params.startDate
          ? t('CART_ITEM_TOOLTIP_SELF_SWITCH')
          : t('CART_ITEM_TOOLTIP_AUTO_SWITCH'),
      }
    },
    [t, formatter],
  )
}

// TODO: retrieve this from API or some sort of central config.
const getProductBasedSummary = (productName: string, data: Record<string, unknown>) => {
  switch (productName) {
    case 'SE_PET_DOG':
    case 'SE_PET_CAT':
      return data.name != null ? (data.name as string) : null
    default:
      return null
  }
}
