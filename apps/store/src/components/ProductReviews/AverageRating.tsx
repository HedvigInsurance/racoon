import { useTranslation } from 'next-i18next'
import { ComponentProps } from 'react'
import { Text } from 'ui'

type Props = {
  score: number
  maxScore: number
} & Partial<Omit<ComponentProps<typeof Text>, 'children'>>

export const AverageRating = ({ score, maxScore, ...others }: Props) => {
  const { t } = useTranslation('common')

  return (
    <Text size={10} color="textPrimary" align="center" {...others}>
      {t('RATING_SCORE_LABEL', { score, maxScore })}
    </Text>
  )
}
