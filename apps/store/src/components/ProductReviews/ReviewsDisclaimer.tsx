import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { TextWithLink } from '@/components/TextWithLink'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  reviewsCount: number
} & Partial<Omit<ComponentProps<typeof TextWithLink>, 'children'>>

export const ReviewsDiclaimer = ({ reviewsCount, ...others }: Props) => {
  const { t } = useTranslation('reviews')
  const { numberGrouping } = useFormatter()
  const locale = useRoutingLocale()

  return (
    <TextWithLink
      href={PageLink.reviews({ locale })}
      color="textSecondary"
      size="md"
      align="center"
      {...others}
    >
      {t('REVIEWS_DISCLAIMER', {
        count: reviewsCount,
        reviewsCount: numberGrouping(reviewsCount),
      })}
    </TextWithLink>
  )
}
