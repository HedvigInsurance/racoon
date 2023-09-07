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
const PET_NAME_FIELD = 'name'
const CAR_REGISTRATION_NUMBER_FIELD = 'registrationNumber'

const getProductBasedSummary = (
  productName: string,
  data: Record<string, unknown>,
): string | null => {
  switch (productName) {
    case 'SE_PET_DOG':
    case 'SE_PET_CAT':
      return getStringOrNull(data[PET_NAME_FIELD])
    case 'SE_CAR':
      return (
        getStringOrNull(data[CAR_REGISTRATION_NUMBER_FIELD])?.replace(/(.{3})(.{3})/, '$1 $2') ??
        null
      )
    default:
      return null
  }
}

const getStringOrNull = (value: unknown): string | null => {
  return typeof value === 'string' ? value : null
}
