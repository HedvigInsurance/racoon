import styled from '@emotion/styled'
import { Input } from '@/services/formTemplate/FormTemplate.types'
import { InputDynamic } from './InputDynamic'

const Grid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: theme.space[3],
}))

type GridItemProps = { columnSpan: number }

const GridItem = styled.div<GridItemProps>(({ columnSpan }) => ({
  gridColumn: `span ${columnSpan}`,
}))

type FormGroupProps = {
  inputs: Array<Input>
}

export const FormGroup = ({ inputs }: FormGroupProps) => {
  return (
    <Grid>
      {inputs.map(({ columnSpan = 6, ...inputProps }) => (
        <GridItem key={inputProps.name} columnSpan={columnSpan}>
          <InputDynamic {...inputProps} />
        </GridItem>
      ))}
    </Grid>
  )
}
