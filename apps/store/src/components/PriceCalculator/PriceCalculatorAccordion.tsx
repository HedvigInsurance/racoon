import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode } from 'react'
import { Heading, Text } from 'ui'
import { SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import * as Accordion from './Accordion'
import { StepIcon } from './StepIcon'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  activeSectionId?: string
  children(section: FormSection, index: number): ReactNode
  form: Form
  shopSession: ShopSession
  onActiveSectionChange(sectionId: string): void
}

export const PriceCalculatorAccordion = (props: Props) => {
  const { form, children, activeSectionId, onActiveSectionChange } = props
  const { t } = useTranslation('purchase-form')
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
      collapsible
    >
      {form.sections.map((section, index) => {
        const isActive = section.id === activeSectionId
        const isValid = section.state === 'valid'
        const showMutedHeading = !(isActive || isValid)
        const showEditButton = isValid && !isActive
        const stepIconState = isValid ? 'valid' : 'outline'

        let content
        if (section.id === SsnSeSection.sectionId) {
          content = (
            <SsnSeSection shopSession={props.shopSession} onCompleted={handleSsnSectionCompleted} />
          )
        } else {
          content = children(section, index)
        }

        return (
          <Accordion.Item key={section.id} value={section.id}>
            <Accordion.Header>
              <SpaceFlex space={0.5} align="center">
                <StepIcon state={isActive ? 'filled' : stepIconState} />
                <StyledHeading
                  as="h3"
                  variant="standard.18"
                  color={showMutedHeading ? 'textSecondary' : 'textPrimary'}
                >
                  {translateLabel(section.title)}
                </StyledHeading>
              </SpaceFlex>
              {showEditButton && (
                <Accordion.Trigger>
                  <StyledText size="md" color="textPrimary">
                    {t('PRICE_CALCULATOR_SECTION_EDIT_BUTTON')}
                  </StyledText>
                </Accordion.Trigger>
              )}
            </Accordion.Header>
            <Accordion.Content>{content}</Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

const StyledHeading = styled(Heading)({ lineHeight: 1 })
const StyledText = styled(Text)({ lineHeight: 1 })
