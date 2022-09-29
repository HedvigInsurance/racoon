import { ReactNode } from 'react'
import { Heading } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Form, FormSection } from '@/services/PriceForm/PriceForm.types'
import * as Accordion from './Accordion'
import { StepIconDefault } from './StepIconDefault'
import { StepIconValid } from './StepIconValid'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = {
  form: Form
  children(section: FormSection): ReactNode
}

export const PriceFormAccordion = ({ form, children }: Props) => {
  const translateLabel = useTranslateTextLabel({ data: {} })
  const activeSection = form.sections.find(({ state }) => state !== 'valid')

  return (
    <Accordion.Root type="single" value={activeSection?.id} collapsible={true}>
      {form.sections.map((section, index) => (
        <Accordion.Item key={section.id} value={section.id}>
          <Accordion.Header>
            <SpaceFlex space={1} align="center">
              {section.state === 'valid' ? (
                <StepIconValid />
              ) : (
                <StepIconDefault>{index + 1}</StepIconDefault>
              )}
              <Heading as="h3" variant="standard.18">
                {translateLabel(section.title)}
              </Heading>
            </SpaceFlex>
            <Accordion.Trigger />
          </Accordion.Header>
          <Accordion.Content>{children(section)}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
