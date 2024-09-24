import { useTranslation } from 'next-i18next'
import { Text, sprinkles } from 'ui'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { type useOfferDetails } from '../hooks/useOfferDetails'

type Props = {
  details: ReturnType<typeof useOfferDetails>
}

export function CartItemProductDetails({ details }: Props) {
  const { t } = useTranslation('cart')

  return (
    <div>
      <Text className={sprinkles({ mb: 'xxs' })}>{t('VIEW_ENTRY_DETAILS_BUTTON')}</Text>

      <DetailsList.Root size="md">
        {details.map(({ title, value }) => (
          <DetailsList.Item key={title}>
            <DetailsList.Label>{title}</DetailsList.Label>
            <DetailsList.Value>{value}</DetailsList.Value>
          </DetailsList.Item>
        ))}
      </DetailsList.Root>
    </div>
  )
}
