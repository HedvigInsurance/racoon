import { ReactNode, useEffect, useRef, useState } from 'react'
import { Heading } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import * as Accordion from './Accordion'
import { StepIconDefault } from './StepIconDefault'
import { StepIconValid } from './StepIconValid'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = {
  form: Form
  children(section: FormSection, index: number): ReactNode
}

export const PriceCalculatorAccordion = ({ form, children }: Props) => {
  const translateLabel = useTranslateTextLabel({ data: {} })
  const [activeSectionId, onActiveSectionChange] = useActiveFormSection(form)

  return (
    <Accordion.Root
      type="single"
      value={activeSectionId}
      onValueChange={onActiveSectionChange}
      collapsible
    >
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
          <Accordion.Content>{children(section, index)}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const useActiveFormSection = (form: Form) => {
  const [activeSectionId, setActiveSectionId] = useState(
    () => form.sections.find(({ state }) => state !== 'valid')?.id,
  )
  const prevActiveSectionRef = useRef<string>()

  const currentSectionIsValid =
    form.sections.find((section) => section.id === activeSectionId)?.state === 'valid'

  useEffect(() => {
    if (currentSectionIsValid && activeSectionId === prevActiveSectionRef.current) {
      const nextSectionId = form.sections.find(({ state }) => state !== 'valid')?.id
      if (nextSectionId) setActiveSectionId(nextSectionId)
    }
  }, [activeSectionId, currentSectionIsValid, form.sections])

  useEffect(() => {
    prevActiveSectionRef.current = activeSectionId
  }, [activeSectionId])

  return [activeSectionId, setActiveSectionId] as const
}
