import { InputField } from 'ui'
import { Input } from '@/services/formTemplate/FormTemplate.types'
import { InputRadio } from './InputRadio'
import { InputSelect } from './InputSelect'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = Input

export const InputDynamic = (props: Props) => {
  const translateTextLabel = useTranslateTextLabel({ data: {} })

  const baseProps = {
    name: props.name,
    label: translateTextLabel(props.label),
    defaultValue: String(props.defaultValue),
    required: props.required,
    placeholder: props.placeholder ? translateTextLabel(props.placeholder) : undefined,
  }

  switch (props.type) {
    case 'select':
      return (
        <InputSelect
          {...baseProps}
          options={props.options.map((option) => ({
            ...option,
            name: translateTextLabel(option.label),
          }))}
        />
      )

    case 'number':
      return <InputField {...baseProps} type="number" min={props.min} max={props.max} />

    case 'date':
      return <InputField {...baseProps} type="date" />

    case 'radio':
      return (
        <InputRadio
          {...baseProps}
          options={props.options.map((option) => ({
            ...option,
            label: translateTextLabel(option.label),
          }))}
        />
      )

    default:
      return <InputField {...baseProps} type="text" pattern={props.pattern} />
  }
}
