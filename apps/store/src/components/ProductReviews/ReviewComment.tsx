import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Review } from '@/features/memberReviews/memberReviews.types'
import { useFormatter } from '@/utils/useFormatter'
import { wrapper, reviewHeader, reviewTag, reviewContent, reviewFooter } from './ReviewComment.css'
import { Stars } from './Stars'
import { VerifiedIcon } from './VerifiedIcon'

type Props = Review & {
  className?: string
}

export function ReviewComment({ score, date, content, attributedTo, className }: Props) {
  const { t } = useTranslation('reviews')
  const tag = useTag(attributedTo)
  const formatter = useFormatter()

  return (
    <div className={clsx(wrapper, className)}>
      <div className={reviewHeader}>
        <Stars score={score} size="1rem" />
        {<span className={reviewTag}>{tag}</span>}
      </div>

      <Text className={reviewContent} size="md">
        {content}
      </Text>

      <div className={reviewFooter}>
        <SpaceFlex direction="horizontal" align="center" space={0.25}>
          <VerifiedIcon />

          <Text as="span" size="xs">
            {t('VERIFIED_CUSTOMER_LABEL')}
          </Text>
        </SpaceFlex>

        <Text as="span" size="xs">
          {formatter.dateFull(new Date(date), { abbreviateMonth: true })}
        </Text>
      </div>
    </div>
  )
}

function useTag(attributedTo: string) {
  const { t } = useTranslation('reviews')

  switch (attributedTo) {
    case 'SE_PET_DOG':
      return t('SE_PET_DOG_REVIEW_COMMENT_TAG')
    case 'SE_PET_CAT':
      return t('SE_PET_CAT_REVIEW_COMMENT_TAG')
    case 'SE_HOUSE':
      return t('SE_HOUSE_REVIEW_COMMENT_TAG')
    case 'SE_APARTMENT_STUDENT':
      return t('SE_APARTMENT_STUDENT_REVIEW_COMMENT_TAG')
    case 'SE_ACCIDENT':
      return t('SE_ACCIDENT_REVIEW_COMMENT_TAG')
    case 'SE_CAR':
      return t('SE_CAR_REVIEW_COMMENT_TAG')
    case 'SE_APARTMENT_BRF':
      return t('SE_APARTMENT_BRF_REVIEW_COMMENT_TAG')
    case 'SE_APARTMENT_RENT':
      return t('SE_APARTMENT_RENT_REVIEW_COMMENT_TAG')
    default:
      return attributedTo
  }
}
