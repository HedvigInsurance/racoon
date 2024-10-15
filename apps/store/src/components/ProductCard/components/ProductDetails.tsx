import { useTranslation } from 'next-i18next'
import { Text, sprinkles } from 'ui'
import { DetailsList } from '@/components/DetailsList/DetailsList'
import { type useOfferDetails } from '../useOfferDetails'

type Props = {
  details: ReturnType<typeof useOfferDetails>
}

export function ProductDetails({ details }: Props) {
  const { t } = useTranslation('cart')

  return (
    <div>
      <Text size={{ _: 'body', sm: 'md' }} className={sprinkles({ mb: 'xxs' })}>
        {t('VIEW_ENTRY_DETAILS_BUTTON')}
      </Text>

      <DetailsList.Root size={{ _: 'body', sm: 'md' }} gap={{ _: 'none', sm: 'xxs' }}>
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
