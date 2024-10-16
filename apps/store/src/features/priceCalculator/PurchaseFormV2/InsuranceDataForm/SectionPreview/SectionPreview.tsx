import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { startTransition, useMemo } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Text } from 'ui'
import { SSN_SE_SECTION_ID } from '@/components/PriceCalculator/SsnSeSection'
import { useTranslateFieldLabel } from '@/components/PriceCalculator/useTranslateFieldLabel'
import { activeFormSectionIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  priceCalculatorShowEditSsnWarningAtom,
  priceCalculatorStepAtom,
} from '@/features/priceCalculator/priceCalculatorAtoms'
import { type FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { useAutoFormat } from '@/utils/useFormatter'
import { editButton, sectionPreview } from './SectionPreview.css'

export function SectionPreview({ section }: { section: FormSection }) {
  const autoFormat = useAutoFormat()
  const translateLabel = useTranslateFieldLabel()
  const { t } = useTranslation('purchase-form')
  const previewText = useMemo(() => {
    if (!section.preview?.fieldName) {
      return
    }

    const item = section.items.find((item) => item.field.name === section.preview?.fieldName)
    const value = item?.field.value
    if (value === undefined) {
      return
    }

    if (section.preview.label) {
      return translateLabel(section.preview.label, parseTranslateOptions(value))
    }

    return autoFormat(section.preview.fieldName, value)
  }, [section, autoFormat, translateLabel])

  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const setStep = useSetAtom(priceCalculatorStepAtom)
  const setShowEditSsnWarning = useSetAtom(priceCalculatorShowEditSsnWarningAtom)
  const handleEdit = () => {
    startTransition(() => {
      if (section.id === SSN_SE_SECTION_ID) {
        setShowEditSsnWarning(true)
      } else {
        setStep('fillForm')
        setActiveSectionId(section.id)
      }
    })
  }

  return (
    <div className={sectionPreview}>
      <div className={sprinkles({ flexGrow: 1, overflow: 'hidden' })}>
        <Text size="xs" color="textSecondary">
          {translateLabel(section.title)}
        </Text>
        <Text size="md" singleLine={true}>
          {previewText}
        </Text>
      </div>
      <Button variant="secondary" size="small" onClick={handleEdit} className={editButton}>
        {t('PRICE_CALCULATOR_SECTION_EDIT_BUTTON')}
      </Button>
    </div>
  )
}

const parseTranslateOptions = (value: unknown) => {
  if (typeof value === 'number') return { count: value }
  if (typeof value === 'string') {
    const intValue = parseInt(value)
    if (!isNaN(intValue)) return { count: intValue }
  }
}
