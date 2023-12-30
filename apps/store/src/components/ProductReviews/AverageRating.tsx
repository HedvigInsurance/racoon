import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text, InfoIcon, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'

type Props = {
  score: number
  maxScore: number
  reviewsCount: number
  explanation?: string
}

export const AverageRating = (props: Props) => {
  const { t } = useTranslation('common')

  return (
    <Wrapper>
      <Text
        as="span"
        color="textPrimary"
        size={{
          _: 10,
          md: 11,
        }}
      >
        {t('RATING_SCORE_LABEL', { score: props.score, maxScore: props.maxScore })}
      </Text>

      <SpaceFlex direction="horizontal" space={0.25} align="center">
        <Text as="span" color="textSecondary">
          {t('RATING_REVIEWS_COUNT_LABEL', { reviewsCount: props.reviewsCount })}
        </Text>

        {props.explanation && (
          <Tooltip message={props.explanation}>
            <button style={{ marginBottom: -2 }}>
              <InfoIcon color={theme.colors.textSecondary} />
            </button>
          </Tooltip>
        )}
      </SpaceFlex>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
