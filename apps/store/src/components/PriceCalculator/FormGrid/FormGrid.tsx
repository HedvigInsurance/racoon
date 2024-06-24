import { assignInlineVars } from '@vanilla-extract/dynamic'
import type { ReactNode } from 'react'
import type { InputField } from '@/services/PriceCalculator/Field.types'
import type { SectionItem } from '@/services/PriceCalculator/PriceCalculator.types'
import { columnSpan, grid, gridItem } from './FormGrid.css'

type FormSectionProps = {
  items: Array<SectionItem>
  children(field: InputField, index: number): ReactNode
}

export const FormGrid = ({ items, children }: FormSectionProps) => {
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
          {children(item.field, index)}
        </div>
      ))}
    </div>
  )
}
