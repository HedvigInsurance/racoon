import { InputBase, InputBaseProps } from 'ui'

type InputSelectProps = InputBaseProps & {
  name: string
  options: Array<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  ...rest
}: InputSelectProps) => {
  return (
    <InputBase {...rest}>
      {() => (
        <select
          id={rest.id}
          name={name}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
        >
          {options.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      )}
    </InputBase>
  )
}
