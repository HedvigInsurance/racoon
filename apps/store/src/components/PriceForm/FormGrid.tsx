import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { InputField } from '@/services/PriceForm/Field.types'
import { SectionItem } from '@/services/PriceForm/PriceForm.types'

const Grid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: theme.space[3],
}))

type GridItemProps = { columnSpan: number }

const GridItem = styled.div<GridItemProps>(({ columnSpan }) => ({
  gridColumn: `span ${columnSpan}`,
}))

type FormSectionProps = {
  items: Array<SectionItem>
  children(field: InputField, index: number): ReactNode
}

export const FormGrid = ({ items, children }: FormSectionProps) => {
  return (
    <Grid>
      {items.map((item, index) => (
        <GridItem key={item.field.name} columnSpan={item.layout.columnSpan}>
          {children(item.field, index)}
        </GridItem>
      ))}
    </Grid>
  )
}
