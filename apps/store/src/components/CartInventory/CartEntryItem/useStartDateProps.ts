import { useTranslation } from 'next-i18next'
import { ComponentProps, useMemo } from 'react'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { useFormatter } from '@/utils/useFormatter'

type Params = {
  productName: string
  data: Record<string, unknown>
  startDate?: Date
}

type StartDateProps = ComponentProps<typeof ProductItem>['startDate']

export const useStartDateProps = (params: Params): StartDateProps => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return useMemo(() => {
    const content: Array<string> = []

    const productBasedSummary = getProductBasedSummary(params.productName, params.data)
    if (productBasedSummary) {
      content.push(productBasedSummary)
    }

    const labels = params.startDate
      ? {
          text: t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(params.startDate) }),
          tooltip: t('CART_ITEM_TOOLTIP_SELF_SWITCH'),
        }
      : {
          text: t('CART_ENTRY_AUTO_SWITCH'),
          tooltip: t('CART_ITEM_TOOLTIP_AUTO_SWITCH'),
        }

    content.push(labels.text)

    return {
      label: content.join(' • '),
      tooltip: labels.tooltip,
    }
  }, [params.productName, params.data, params.startDate, t, formatter])
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
