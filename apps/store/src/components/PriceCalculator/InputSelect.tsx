import { InputBase, InputBaseProps } from 'ui'

type InputSelectProps = InputBaseProps & {
  name: string
  options: Array<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  placeholder?: string
}

export const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  placeholder,
  ...rest
}: InputSelectProps) => {
  return (
    <InputBase {...rest}>
      {() => (
        <select name={name} onChange={onChange} value={value} defaultValue={defaultValue} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
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
