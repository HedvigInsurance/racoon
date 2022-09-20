import { InputField } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { FormTemplateField } from '@/services/formTemplate/FormTemplate.types'
import { InputRadio } from './InputRadio'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = FormTemplateField

export const DynamicField = (props: Props) => {
  const translateTextLabel = useTranslateTextLabel({ data: {} })

  const baseProps = {
    name: props.name,
    label: props.label ? translateTextLabel(props.label) : undefined,
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

    case 'hidden':
      return <input type="hidden" name={props.name} value={props.defaultValue} />

    default:
      return (
        <InputField
          {...baseProps}
          type="text"
          pattern={props.pattern}
          minLength={props.minLength}
          maxLength={props.maxLength}
        />
      )
  }
}
