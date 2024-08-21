import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Text, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useFormatter } from '@/utils/useFormatter'
import { wrapper, disclaimerText } from './PillowHeader.css'

type Props = {
  title: string
  score: number
  reviewsCount: number
  pillow: Omit<ComponentProps<typeof Pillow>, 'className' | 'size'>
  className?: string
}

export const PillowHeader = ({ title, score, reviewsCount, pillow, className }: Props) => {
  const { numberGrouping } = useFormatter()
  const { t } = useTranslation('reviews')

  return (
    <div className={clsx(wrapper, className)}>
      <Pillow size="xlarge" {...pillow} />

      <Space y={1}>
        <div>
          <Text size={{ _: 'xs', sm: 'md' }} align="center">
            {title}
          </Text>
          <Text size={{ _: 'xs', sm: 'md' }} align="center" color="textSecondary">
            {t('RATING_SCORE_LABEL', { score: score, maxScore: MAX_SCORE })}
            {' · '}
            {t('REVIEWS_COUNT_LABEL', {
              count: reviewsCount,
              reviewsCount: numberGrouping(reviewsCount),
            })}
          </Text>
        </div>
        <Text
          className={disclaimerText}
          size={{ _: 'xs', sm: 'md' }}
          align="center"
          color="textSecondary"
        >
          {t('PILLOW_HEADER_REVIEWS_DISCLAIMER')}
        </Text>
      </Space>
    </div>
  )
}
