import { assignInlineVars } from '@vanilla-extract/dynamic'
import { useAtomValue } from 'jotai'
import { Button } from 'ui'
import { AutomaticField } from '@/components/PriceCalculator/AutomaticField'
import { useTranslateFieldLabel } from '@/components/PriceCalculator/useTranslateFieldLabel'
import { priceCalculatorLoadingAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type InputField } from '@/services/PriceCalculator/Field.types'
import type { Label, SectionItem } from '@/services/PriceCalculator/PriceCalculator.types'
import { columnSpan, grid, gridItem, submitButton } from './FormGridNew.css'

type FormSectionProps = {
  items: Array<SectionItem>
  submitLabel: Label
  autofocusFirst?: boolean
}

export function FormGridNew({ items, autofocusFirst, submitLabel }: FormSectionProps) {
  const isLoading = useAtomValue(priceCalculatorLoadingAtom)
  const translateLabel = useTranslateFieldLabel()
  return (
    <div className={grid}>
      {items.map((item, index) => (
        <div
          className={gridItem}
          key={item.field.name}
          style={assignInlineVars({
            [columnSpan]: `${item.layout.columnSpan}`,
          })}
        >
          <AutomaticField
            key={fieldKey(item.field)}
            field={item.field}
            autoFocus={autofocusFirst && index === 0}
          />
        </div>
      ))}

      <Button type="submit" loading={isLoading} fullWidth={true} className={submitButton}>
        {translateLabel(submitLabel)}
      </Button>
    </div>
  )
}

// GOTCHA: Uncontrolled fields keep very first defaultValue they had
// Therefore, we want to remount the field when default changes from empty to non-empty
// But not when default changes from one value to another - this risks loosing user input
const fieldKey = (field: InputField): string => {
  const hasNonEmptyValue =
    (field.defaultValue != null && field.defaultValue !== '') ||
    (field.value != null && field.value !== '')
  return `${field.name}_${hasNonEmptyValue}`
}
