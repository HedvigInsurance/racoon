import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import {
  activeFormSectionIdAtom,
  priceCalculatorFormAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { priceCalculatorStepAtom } from '../../priceCalculatorAtoms'
import { bar, progressBar } from './ProgressBar.css'

export function ProgressBar() {
  const step = useAtomValue(priceCalculatorStepAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const form = useAtomValue(priceCalculatorFormAtom)
  const progress = getPriceCalculatorProgress(step, activeSectionId, form.sections)

  return (
    <div className={bar}>
      <motion.div
        className={progressBar}
        style={{ originX: 0, scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

function getPriceCalculatorProgress(
  step: string,
  activeSectionId: string,
  sections: Array<FormSection>,
) {
  let progress = '0%'

  switch (step) {
    case 'fillForm':
      switch (activeSectionId) {
        case 'ssn-se':
          // Don't show any progress in first section
          break
        default: {
          // +1 because we want to account for two additional steps:
          // 'calculatingPrice' and 'viewOffers' but excluding 'ssn' step
          const nrOfSteps = sections.length + 1
          const activeSectionIndex = sections.findIndex((section) => section.id === activeSectionId)

          if (activeSectionIndex !== -1) {
            progress = `${(activeSectionIndex / nrOfSteps) * 100}%`
          }
        }
      }
      break
    case 'calculatingPrice':
      progress = '70%'
      break
    case 'viewOffers':
      progress = '80%'
      break
    case 'purchaseSummary':
      progress = '100%'
      break
  }

  return progress
}
