import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  reviewsCount: number
} & Partial<Omit<ComponentProps<typeof Text>, 'children'>>

export const ReviewsDiclaimer = ({ reviewsCount, ...others }: Props) => {
  const { t } = useTranslation('reviews')
  const { numberGrouping } = useFormatter()

  return (
    <Text color="textSecondary" align="center" {...others}>
      {t('REVIEWS_DISCLAIMER', {
        count: reviewsCount,
        reviewsCount: numberGrouping(reviewsCount),
      })}
    </Text>
  )
}
