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
  loading: boolean
} & React.ComponentPropsWithoutRef<'form'>

export const PriceCalculatorForm = ({
  template,
  loading,
  ...formProps
}: PriceCalculatorFormProps) => {
  const translateTextLabel = useTranslateTextLabel({ data: {} })

  const activeSection = template.sections.find(({ state }) => state !== 'VALID')

  return (
    <form {...formProps}>
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
                  <Button type="submit" fullWidth disabled={loading}>
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
}

const Title = styled.h2(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  color: theme.colors.gray900,
}))
