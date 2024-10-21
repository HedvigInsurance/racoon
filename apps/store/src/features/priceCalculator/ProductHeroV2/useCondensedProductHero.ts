import { useAtomValue } from 'jotai'
import { activeFormSectionIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { priceCalculatorStepAtom } from '../priceCalculatorAtoms'

// The condensed state is used to show the sticky header and hides the large product pillow
export const useCondensedProductHero = () => {
  const step = useAtomValue(priceCalculatorStepAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const showCondensedProductHero = step === 'fillForm' && activeSectionId !== 'ssn-se'
  return showCondensedProductHero
}
