import { assignInlineVars } from '@vanilla-extract/dynamic'
import { AutomaticField } from '@/components/PriceCalculator/AutomaticField'
import type { SectionItem } from '@/services/PriceCalculator/PriceCalculator.types'
import { columnSpan, grid, gridItem } from './FormGrid.css'

type FormSectionProps = {
  items: Array<SectionItem>
  autofocusFirst?: boolean
}

export const FormGrid = ({ items, autofocusFirst }: FormSectionProps) => {
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
            // GOTCHA: Uncontrolled fields keep very first defaultValue they had
            // Therefore, we want to remount the field when default changes from empty to non-empty
            // But not when default changes from one value to another - this risks loosing user input
            key={`${item.field.name}_${item.field.defaultValue == null || item.field.defaultValue === ''}`}
            field={item.field}
            autoFocus={autofocusFirst && index === 0}
          />
        </div>
      ))}
    </div>
  )
}
