import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Text, tokens, xStack } from 'ui'
import { useTranslateFieldLabel } from '@/components/PriceCalculator/useTranslateFieldLabel'
import { activeFormSectionIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { useAutoFormat } from '@/utils/useFormatter'

export function SectionPreview({ section }: { section: FormSection }) {
  const autoFormat = useAutoFormat()
  const translateLabel = useTranslateFieldLabel()
  const { t } = useTranslation('purchase-form')
  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const previewText = useMemo(() => {
    if (!section.preview?.fieldName) return

    const item = section.items.find((item) => item.field.name === section.preview?.fieldName)
    const value = item?.field.value
    if (value === undefined) return

    if (section.preview.label) {
      return translateLabel(section.preview.label, parseTranslateOptions(value))
    }

    return autoFormat(section.preview.fieldName, value)
  }, [section, translateLabel, autoFormat])

  const handleEdit = () => setActiveSectionId(section.id)

  return (
    <div
      className={clsx(xStack({}), sprinkles({ padding: 'md' }))}
      style={{ backgroundColor: tokens.colors.backgroundStandard, borderRadius: tokens.radius.md }}
    >
      <Text className={sprinkles({ flexGrow: 1 })}>{previewText}</Text>
      <Button
        variant="secondary"
        size={'small'}
        style={{ backgroundColor: tokens.colors.white }}
        onClick={handleEdit}
      >
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