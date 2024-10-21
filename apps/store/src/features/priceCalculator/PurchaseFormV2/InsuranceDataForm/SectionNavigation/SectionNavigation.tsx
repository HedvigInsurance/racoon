import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { startTransition } from 'react'
import { Button, ChevronIcon, Text } from 'ui'
import { SSN_SE_SECTION_ID } from '@/components/PriceCalculator/SsnSeSection'
import {
  priceCalculatorFormAtom,
  activeFormSectionIdAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  priceCalculatorShowEditSsnWarningAtom,
  priceCalculatorStepAtom,
} from '../../../priceCalculatorAtoms'
import { sectionNavigationWrapper } from './SectionNavigation.css'

export function SectionNavigation() {
  const { t } = useTranslation('purchase-form')
  const form = useAtomValue(priceCalculatorFormAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const setShowEditSsnWarning = useSetAtom(priceCalculatorShowEditSsnWarningAtom)
  const setStep = useSetAtom(priceCalculatorStepAtom)
  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)

  const activeSectionIndex = form.sections.findIndex((section) => section.id === activeSectionId)
  const previousSection = form.sections[activeSectionIndex - 1]
  const sectionIndicatorLabel = t('SECTION_NAVIGATION_INDICATOR_LABEL', {
    currentSection: activeSectionIndex + 1,
    totalSections: form.sections.length,
  })

  const handlePreviousSection = () => {
    startTransition(() => {
      if (previousSection.id === SSN_SE_SECTION_ID) {
        setShowEditSsnWarning(true)
      } else {
        setStep('fillForm')
        setActiveSectionId(previousSection.id)
      }
    })
  }

  return (
    <div className={sectionNavigationWrapper}>
      <Button
        size="small"
        variant="secondary"
        Icon={<ChevronIcon size="0.75rem" direction="left" />}
        onClick={handlePreviousSection}
      >
        {t('SECTION_NAVIGATION_BUTTON_LABEL')}
      </Button>
      <Text color="textSecondary" size="sm">
        {sectionIndicatorLabel}
      </Text>
    </div>
  )
}
