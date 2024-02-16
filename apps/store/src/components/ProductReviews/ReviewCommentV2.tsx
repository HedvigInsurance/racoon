import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Review } from '@/features/memberReviews/memberReviews.types'
import { useFormatter } from '@/utils/useFormatter'
import { wrapper, reviewContent, footer } from './ReviewCommentV2.css'
import { Stars } from './Stars'
import { VerifiedIcon } from './VerifiedIcon'

type Props = Review & {
  className?: string
}

export const ReviewCommentV2 = ({ score, date, content, className }: Props) => {
  const { t } = useTranslation('common')
  const formatter = useFormatter()

  return (
    <div className={clsx(wrapper, className)}>
      <Stars score={score} size="1rem" />

      <Text className={reviewContent}>{content}</Text>

      <footer className={footer}>
        <SpaceFlex direction="horizontal" align="center" space={0.25}>
          <VerifiedIcon />

          <Text as="span" size="xs">
            {t('VERIFIED_CUSTOMER_LABEL')}
          </Text>
        </SpaceFlex>

        <Text as="span" size="xs">
          {formatter.dateFull(new Date(date), { abbreviateMonth: true })}
        </Text>
      </footer>
    </div>
  )
}
