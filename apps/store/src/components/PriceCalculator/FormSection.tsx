import styled from '@emotion/styled'
import { FormTemplateField } from '@/services/formTemplate/FormTemplate.types'
import { DynamicField } from './DynamicField'

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
}

export const FormGroup = ({ fields }: FormSectionProps) => {
  return (
    <Grid>
      {fields.map(({ columnSpan = 6, ...fieldProps }) => (
        <GridItem key={fieldProps.name} columnSpan={columnSpan}>
          <DynamicField {...fieldProps} />
        </GridItem>
      ))}
    </Grid>
  )
}
