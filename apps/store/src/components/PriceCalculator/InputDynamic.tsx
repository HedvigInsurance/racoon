import { InputField } from 'ui'
import { InputSelect } from './InputSelect'
import { Input } from './PriceCalculator.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = Input

export const InputDynamic = (props: Props) => {
  const translateTextLabel = useTranslateTextLabel()

  const baseProps = {
    name: props.name,
    label: translateTextLabel(props.label),
    defaultValue: props.defaultValue,
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
            name: translateTextLabel(option.name),
          }))}
        />
      )

    case 'number':
      return <InputField {...baseProps} type="number" min={props.min} max={props.max} />

    default:
      return <InputField {...baseProps} type="text" pattern={props.pattern} />
  }
}
