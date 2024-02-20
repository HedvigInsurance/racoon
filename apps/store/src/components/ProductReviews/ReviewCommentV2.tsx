import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Review } from '@/features/memberReviews/memberReviews.types'
import { useFormatter } from '@/utils/useFormatter'
import {
  wrapper,
  reviewHeader,
  reviewTag,
  reviewContent,
  reviewFooter,
} from './ReviewCommentV2.css'
import { Stars } from './Stars'
import { VerifiedIcon } from './VerifiedIcon'

type Props = Review & {
  className?: string
}

export const ReviewCommentV2 = ({ score, date, tag, content, className }: Props) => {
  const { t } = useTranslation('reviews')
  const formatter = useFormatter()

  return (
    <div className={clsx(wrapper, className)}>
      <div className={reviewHeader}>
        <Stars score={score} size="1rem" />
        {/* @ts-expect-error couldn't find a way to tell TS that tag string content belongs to 'reviews' namespace */}
        {tag && <span className={reviewTag}>{t(tag)}</span>}
      </div>

      <Text className={reviewContent}>{content}</Text>

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
