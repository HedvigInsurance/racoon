import clsx from 'clsx'
import { yStack, xStack } from 'ui'
import { useIsPriceIntentStateReady } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { stickyProductHeader, stickyProductHeaderContent } from './StickyProductHeader.css'

type Props = {
  children: React.ReactNode
  hasScrolledPast: boolean
}

export function StickyProductHeader({ children, hasScrolledPast }: Props) {
  const isReady = useIsPriceIntentStateReady()

  return (
    <div className={stickyProductHeader}>
      <div
        className={clsx(
          yStack({
            gap: 'md',
            paddingBlock: 'sm',
            paddingInline: 'md',
          }),
          stickyProductHeaderContent.base,
          hasScrolledPast && stickyProductHeaderContent.visible,
        )}
      >
        <div
          className={clsx(
            xStack({
              gap: 'sm',
              alignItems: 'center',
            }),
          )}
        >
          {children}
        </div>

        {isReady && <ProgressBar />}
      </div>
    </div>
  )
}
