import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import * as Accordion from './Accordion'
import { FormGroup } from './FormSection'
import { StepIconDefault } from './StepIconDefault'
import { StepIconValid } from './StepIconValid'
import { useTranslateTextLabel } from './useTranslateTextLabel'

export type PriceCalculatorFormProps = {
  template: FormTemplate
}

export const PriceCalculatorForm = ({ template }: PriceCalculatorFormProps) => {
  const translateTextLabel = useTranslateTextLabel({ data: {} })

  const activeSection = template.sections.find(({ state }) => state !== 'VALID')
  const isFinalSection =
    activeSection && template.sections.indexOf(activeSection) === template.sections.length - 1

  return (
    <Accordion.Root type="single" value={activeSection?.id} collapsible={true}>
      {template.sections.map(({ id, title, submit, fields, state }, index) => (
        <Accordion.Item key={id} value={id}>
          <Accordion.Header>
            <SpaceFlex space={1} align="center">
              {state === 'VALID' ? (
                <StepIconValid />
              ) : (
                <StepIconDefault>{index + 1}</StepIconDefault>
              )}
              <Title>{translateTextLabel(title)}</Title>
            </SpaceFlex>
            <Accordion.Trigger />
          </Accordion.Header>
          <Accordion.Content>
            <Space y={2}>
              <FormGroup fields={fields} />

              <footer>
                {isFinalSection && <input type="hidden" name="intent" value="confirm" />}
                <Button type="submit" fullWidth>
                  {translateTextLabel(submit)}
                </Button>
              </footer>
            </Space>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const Title = styled.h2(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  color: theme.colors.gray900,
}))
