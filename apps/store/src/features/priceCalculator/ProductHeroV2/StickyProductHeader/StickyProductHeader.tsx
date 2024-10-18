import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { yStack, xStack } from 'ui'
import { activeFormSectionIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { priceCalculatorStepAtom } from '../../priceCalculatorAtoms'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { stickyProductHeader, stickyProductHeaderContent } from './StickyProductHeader.css'

type Props = {
  children: React.ReactNode
  hasScrolledPast: boolean
}

export function StickyProductHeader({ children, hasScrolledPast }: Props) {
  const step = useAtomValue(priceCalculatorStepAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const showStickyHeader = (step === 'fillForm' && activeSectionId !== 'ssn-se') || hasScrolledPast

  // Scroll to top when calculating price to reset haseScrolledPast value
  if (step === 'calculatingPrice') {
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
