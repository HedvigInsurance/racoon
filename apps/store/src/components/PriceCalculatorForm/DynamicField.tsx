import { FormEventHandler } from 'react'
import { Button, InputField } from 'ui'
import * as Dialog from '@/components/Dialog/Dialog'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { FormTemplateField } from '@/services/formTemplate/FormTemplate.types'
import { FormGroup } from './FormSection'
import { InputRadio } from './InputRadio'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = FormTemplateField & {
  onSubmit: FormEventHandler
  loading: boolean
}

export const DynamicField = ({ onSubmit, loading, ...props }: Props) => {
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

    case 'array':
      return (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button type="button">{translateTextLabel(props.label)}</Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <h3>{translateTextLabel(props.label)}</h3>

            <form onSubmit={onSubmit}>
              <FormGroup fields={props.fields}>
                {(fieldProps) => (
                  <DynamicField {...fieldProps} onSubmit={onSubmit} loading={loading} />
                )}
              </FormGroup>

              <SpaceFlex space={1}>
                <Dialog.Close asChild>
                  <Button type="button" variant="text">
                    Close
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={loading}>
                  Add
                </Button>
              </SpaceFlex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      )

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
