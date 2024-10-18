import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { yStack, xStack } from 'ui'
import { priceCalculatorStepAtom } from '../../priceCalculatorAtoms'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { useCondensedProductHero } from '../useCondensedProductHero'
import { stickyProductHeader, stickyProductHeaderContent } from './StickyProductHeader.css'

type Props = {
  children: React.ReactNode
  hasScrolledPast: boolean
}

export function StickyProductHeader({ children, hasScrolledPast }: Props) {
  const step = useAtomValue(priceCalculatorStepAtom)
  const isCondensedProductHero = useCondensedProductHero()
  const showStickyHeader = isCondensedProductHero || hasScrolledPast

  // Scroll to top when going to next step to avoid sticky header overlap
  if (isCondensedProductHero || step === 'calculatingPrice') {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

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
          showStickyHeader && stickyProductHeaderContent.visible,
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

        <ProgressBar />
      </div>
    </div>
  )
}
