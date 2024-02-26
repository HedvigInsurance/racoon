import { useTranslation } from 'next-i18next'
import { ComponentProps } from 'react'
import { Text } from 'ui'

type Props = {
  score: number
  maxScore: number
} & Partial<Omit<ComponentProps<typeof Text>, 'children'>>

export const AverageRatingV2 = ({ score, maxScore, ...others }: Props) => {
  const { t } = useTranslation('reviews')

  return (
    <Text size={11} color="textPrimary" align="center" {...others}>
      {t('RATING_SCORE_LABEL', { score, maxScore })}
    </Text>
  )
}
