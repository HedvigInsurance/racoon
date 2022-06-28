import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { InputDynamic } from './InputDynamic'
import { Input } from './PriceCalculator.types'

const Grid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.space[2],
}))

type GridItemProps = { columnSpan: number }

const GridItem = styled.div<GridItemProps>(({ columnSpan }) => ({
  gridColumn: `span ${columnSpan}`,
}))

type FormGroupProps = {
  inputs: Array<Input>
  onSubmit: (data: FormData) => void
}

export const FormGroup = ({ inputs, onSubmit }: FormGroupProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={2}>
        <Grid>
          {inputs.map(({ columnSpan = 1, ...inputProps }) => (
            <GridItem key={inputProps.name} columnSpan={columnSpan}>
              <InputDynamic {...inputProps} />
            </GridItem>
          ))}
        </Grid>

        <Button type="submit" fullWidth>
          Calculate
        </Button>
      </Space>
    </form>
  )
}
