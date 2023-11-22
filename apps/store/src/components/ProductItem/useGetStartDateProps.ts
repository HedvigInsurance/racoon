import { useTranslation } from 'next-i18next'
import { type ComponentProps, useCallback } from 'react'
import { useFormatter } from '@/utils/useFormatter'
import { type ProductItem } from './ProductItem'

type Params = {
  data: Record<string, unknown>
  startDate?: string
}

type StartDateProps = Required<ComponentProps<typeof ProductItem>['startDate']>

type GetStartDateProps = (params: Params) => StartDateProps

export const useGetStartDateProps = (): GetStartDateProps => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return useCallback(
    (params) => {
      return {
        label: params.startDate
          ? t('CART_ENTRY_DATE_LABEL', {
              date: formatter.dateFull(new Date(params.startDate), { abbreviateMonth: true }),
            })
          : t('CART_ENTRY_AUTO_SWITCH'),
        tooltip: params.startDate
          ? t('CART_ITEM_TOOLTIP_SELF_SWITCH')
          : t('CART_ITEM_TOOLTIP_AUTO_SWITCH'),
      }
    },
    [t, formatter],
  )
}
