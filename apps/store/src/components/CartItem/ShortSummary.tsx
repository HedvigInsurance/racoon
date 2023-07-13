import { useTranslation } from 'react-i18next'
import { InfoIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { Tooltip } from './Tooltip'

type Props = {
  productName: string
  data: Record<string, unknown>
  startDate?: Date
}

export const ShortSummary = (props: Props) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const content: Array<string> = []

  const productBasedSummary = getProductBasedSummary(props.productName, props.data)
  if (productBasedSummary) {
    content.push(productBasedSummary)
  }

  const labels = props.startDate
    ? {
        text: t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(props.startDate) }),
        tooltip: t('CART_ITEM_TOOLTIP_SELF_SWITCH'),
      }
    : {
        text: t('CART_ENTRY_AUTO_SWITCH'),
        tooltip: t('CART_ITEM_TOOLTIP_AUTO_SWITCH'),
      }

  content.push(labels.text)

  return (
    <SpaceFlex space={0.25} align="center">
      <Text color="textSecondary">{content.join(' • ')}</Text>
      <Tooltip message={labels.tooltip}>
        <button onClick={(event) => event.stopPropagation()} style={{ marginBottom: -2 }}>
          <InfoIcon color={theme.colors.textSecondary} />
        </button>
      </Tooltip>
    </SpaceFlex>
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
