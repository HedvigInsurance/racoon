import { Button, InputStepper, Space } from 'ui'
import { InputRadio, RadioGroup } from './radio-group'

import { InputField } from '../types'
import styled from '@emotion/styled'
import { useForm } from 'hooks/use-form'
import useRouterRefresh from 'hooks/use-router-refresh'
import { useTranslation } from 'next-i18next'

const Wrapper = styled(Space)({
  padding: '0.75rem 1rem',
})

const SubmitButton = styled(Button)({
  width: '100%',
})

export type QuickFormProps = {
  quoteCartId: string
  fields: Array<InputField>
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
      <Wrapper y={1.5}>
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
          }
        })}

        <SubmitButton type="submit" disabled={state === 'submitting'}>
          Update information
        </SubmitButton>
      </Wrapper>
    </form>
  )
}
