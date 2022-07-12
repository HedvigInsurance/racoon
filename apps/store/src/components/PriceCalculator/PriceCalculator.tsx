import { forwardRef } from 'react'
import { Button, Space } from 'ui'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import * as Accordion from './Accordion'
import { FormGroup } from './FormSection'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type OnSubmitParams = { data: Record<string, string> }

export type PriceCalculatorProps = {
  template: FormTemplate
  onSubmit: (params: OnSubmitParams) => void
}

const createHandleSubmit =
  (onSubmit: (params: OnSubmitParams) => void) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const userData: Record<string, string> = {}
    data.forEach((value, key) => {
      if (typeof value !== 'string') return
      userData[key] = value
    })

    onSubmit({ data: userData })
  }

export const PriceCalculator = forwardRef<HTMLFormElement, PriceCalculatorProps>(
  ({ template, onSubmit }, ref) => {
    const translateTextLabel = useTranslateTextLabel({ data: {} })

    const handleSubmit = createHandleSubmit(onSubmit)

    const activeSection = template.sections.find(({ state }) => state !== 'VALID')

    return (
      <form ref={ref} onSubmit={handleSubmit}>
        <Accordion.Root type="single" value={activeSection?.id} collapsible={true}>
          {template.sections.map(({ id, title, submit, fields, state }, index) => (
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
                  <FormGroup fields={fields} />

                  <footer>
                    <Button type="submit" fullWidth>
                      {translateTextLabel(submit)}
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
