import { Button } from 'ui'
import { InputDynamic } from './InputDynamic'
import { Input } from './PriceCalculator.types'

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
      {inputs.map((inputProps) => (
        <InputDynamic key={inputProps.name} {...inputProps} />
      ))}

      <Button type="submit">Continue</Button>
    </form>
  )
}
