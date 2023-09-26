import { useTranslation } from 'next-i18next'
import { type ComponentProps, useCallback } from 'react'
import { useFormatter } from '@/utils/useFormatter'
import { type ProductItem } from './ProductItem'

type Params = {
  exposure: string
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
      const content = [
        params.exposure,
        params.startDate
          ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(new Date(params.startDate)) })
          : t('CART_ENTRY_AUTO_SWITCH'),
      ]

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
