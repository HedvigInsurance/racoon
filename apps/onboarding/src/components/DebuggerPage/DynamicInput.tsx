import { InputField } from '@/components/InputField/InputField'
import { Input } from './DebuggerPage.types'
import { InputSelect } from './InputSelect'

type Props = Input

export const DynamicInput = (props: Props) => {
  switch (props.type) {
    case 'select':
      return (
        <InputSelect
          label={props.label}
          name={props.name}
          options={props.options}
          defaultValue={props.defaultValue}
        />
      )
    default:
      return (
        <InputField
          key={props.name}
          name={props.name}
          label={props.label}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          type={props.type}
        />
      )
  }
}
