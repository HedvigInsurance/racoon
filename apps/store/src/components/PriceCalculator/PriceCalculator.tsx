import { forwardRef } from 'react'
import { Button, Space } from 'ui'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import * as Accordion from './Accordion'
import { FormGroup } from './FormGroup'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type OnSubmitParams = { data: Record<string, string> }

export type PriceCalculatorProps = {
  form: FormTemplate
  onSubmit: (params: OnSubmitParams) => void
}

export const PriceCalculator = forwardRef<HTMLFormElement, PriceCalculatorProps>(
  ({ form, onSubmit }, ref) => {
    const translateTextLabel = useTranslateTextLabel({ data: {} })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)

      const userData: Record<string, string> = {}
      data.forEach((value, key) => {
        if (typeof value !== 'string') return
        userData[key] = value
      })

      onSubmit({ data: userData })
    }

    const selectedGroup = form.groups.find((group) => group.state !== 'VALID')

    return (
      <form ref={ref} onSubmit={handleSubmit}>
        <Accordion.Root type="single" value={selectedGroup?.id} collapsible={true}>
          {form.groups.map(({ id, title, cta, inputs, state }, index) => (
            <Accordion.Item key={id} value={id}>
              <Accordion.Header>
                <SpaceFlex space={1}>
                  {state === 'VALID' ? '✅' : state === 'INVALID' ? '❌' : `${index + 1}.`}
                  <h2>{translateTextLabel(title)}</h2>
                </SpaceFlex>
                <Accordion.Trigger />
              </Accordion.Header>
              <Accordion.Content>
                <Space y={2}>
                  <FormGroup inputs={inputs} />

                  <footer>
                    <Button type="submit" fullWidth>
                      {translateTextLabel(cta)}
                    </Button>
                  </footer>
                </Space>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </form>
    )
  },
)

PriceCalculator.displayName = 'PriceCalculator'
