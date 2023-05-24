import { useTranslation } from 'react-i18next'
import { Text } from 'ui'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from '../CartInventory.types'

export const ShortSummary = ({ cartEntry }: { cartEntry: CartEntry }) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const content: Array<string> = []

  const productBasedSummary = getProductBasedSummary(cartEntry)
  if (productBasedSummary) {
    content.push(productBasedSummary)
  }

  const activationDate = cartEntry.startDate
    ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(cartEntry.startDate) })
    : t('CART_ENTRY_AUTO_SWITCH')
  content.push(activationDate)

  return <Text color="textSecondary">{content.join(' • ')}</Text>
}

// TODO: retrieve this from API or some sort of central config.
const getProductBasedSummary = (cartEntry: CartEntry) => {
  switch (cartEntry.productName) {
    case 'SE_PET_DOG':
    case 'SE_PET_CAT':
      return cartEntry.data.name != null ? (cartEntry.data.name as string) : null
    default:
      return null
  }
}
