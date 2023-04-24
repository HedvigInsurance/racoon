import { ReactNode } from 'react'
import { SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import * as Accordion from './Accordion'
import { PriceCalculatorAccordionSection } from './PriceCalculatorAccordionSection'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  activeSectionId?: string
  children: (section: FormSection, index: number) => ReactNode
  form: Form
  shopSession: ShopSession
  onActiveSectionChange: (sectionId: string) => void
}

export const PriceCalculatorAccordion = (props: Props) => {
  const { form, children, activeSectionId, onActiveSectionChange } = props
  const translateLabel = useTranslateFieldLabel()

  const handleSsnSectionCompleted = () => {
    const nextSectionIndex =
      form.sections.findIndex((section) => section.id === SsnSeSection.sectionId) + 1
    if (!form.sections[nextSectionIndex]) {
      throw new Error(`Failed to find section after ${SsnSeSection.sectionId}`)
    }
    onActiveSectionChange(form.sections[nextSectionIndex].id)
  }

  return (
    <Accordion.Root
      type="single"
      value={activeSectionId}
      onValueChange={onActiveSectionChange}
      collapsible={true}
    >
      {form.sections.map((section, index) => {
        let content
        if (section.id === SsnSeSection.sectionId) {
          content = (
            <SsnSeSection shopSession={props.shopSession} onCompleted={handleSsnSectionCompleted} />
          )
        } else {
          content = children(section, index)
        }

        return (
          <PriceCalculatorAccordionSection
            key={section.id}
            active={section.id === activeSectionId}
            valid={section.state === 'valid'}
            title={translateLabel(section.title)}
            value={section.id}
            previewFieldName={section.preview?.fieldName}
            previewLabel={section.preview?.label}
            items={section.items}
          >
            {content}
          </PriceCalculatorAccordionSection>
        )
      })}
    </Accordion.Root>
  )
}
