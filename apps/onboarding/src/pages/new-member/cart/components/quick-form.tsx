import styled from '@emotion/styled'
import { useForm } from 'hooks/use-form'
import useRouterRefresh from 'hooks/use-router-refresh'
import { useTranslation } from 'next-i18next'
import { Button, InputField, InputStepper, Space } from 'ui'
import type { InputField as InputFieldType } from '../types'
import { InputRadio, RadioGroup } from './radio-group'

const Wrapper = styled.div({
  padding: '1.25rem 1rem',
})

const SubmitButton = styled(Button)({
  width: '100%',
})

export type QuickFormProps = {
  quoteCartId: string
  fields: Array<InputFieldType>
}

export const QuickForm = ({ quoteCartId, fields }: QuickFormProps) => {
  const { t } = useTranslation()

  const refreshData = useRouterRefresh()
  const { state, formProps } = useForm({
    action: `/api/pages/cart/${quoteCartId}`,
    onSuccess: refreshData,
  })

  return (
    <form {...formProps}>
      <Wrapper>
        <Space y={1.5}>
          <Space y={0.5}>
            {fields.map((field) => {
              switch (field.type) {
                case 'stepper':
                  return <InputStepper key={field.name} {...field} label={t(field.label)} />
                case 'radio':
                  return (
                    <RadioGroup key={field.name} label={t(field.label)}>
                      {field.options.map((option) => (
                        <InputRadio
                          key={option.value}
                          id={field.name + option.value}
                          name={field.name}
                          {...option}
                        />
                      ))}
                    </RadioGroup>
                  )
                case 'number':
                  return (
                    <InputField
                      key={field.name}
                      {...field}
                      label={t(field.label)}
                      type="number"
                      min={field.min}
                      max={field.max}
                    />
                  )
              }
            })}
          </Space>
          <SubmitButton type="submit" variant="outlined" disabled={state === 'submitting'}>
            Update information
          </SubmitButton>
        </Space>
      </Wrapper>
    </form>
  )
}
