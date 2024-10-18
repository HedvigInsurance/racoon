import { type ReactNode, type ReactElement } from 'react'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { Space, CrossIcon } from 'ui'
import type { ReviewsDistribution } from '@/features/memberReviews/memberReviews.types'
import { dialogContent, dialogCloseBtn, dialogWindow } from './dialogStyles.css'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'

type Props = {
  reviewsDistribution: ReviewsDistribution
  children: ReactNode
  Header?: ReactElement
  onClose?: () => void
}

export function ReviewsDistributionDialog({
  reviewsDistribution,
  children,
  onClose,
  Header,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>

      <Dialog.Content className={dialogContent} centerContent={true} onClose={onClose}>
        <Dialog.Close className={dialogCloseBtn} onClick={onClose}>
          <CrossIcon size="1rem" />
        </Dialog.Close>

        <Dialog.Window className={dialogWindow}>
          <Space y={2}>
            {Header}

            <section>
              {reviewsDistribution.map(([score, percentage]) => (
                <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
              ))}
            </section>
          </Space>
        </Dialog.Window>
      </Dialog.Content>
    </Dialog.Root>
  )
}
