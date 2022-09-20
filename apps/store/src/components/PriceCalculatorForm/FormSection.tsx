import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { FormTemplateField } from '@/services/formTemplate/FormTemplate.types'

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
  fields: Array<FormTemplateField>
  children(fieldProps: FormTemplateField): ReactNode
}

export const FormGroup = ({ fields, children }: FormSectionProps) => {
  return (
    <Grid>
      {fields.map(({ columnSpan = 6, ...fieldProps }) => (
        <GridItem key={fieldProps.name} columnSpan={columnSpan}>
          {children(fieldProps)}
        </GridItem>
      ))}
    </Grid>
  )
}
