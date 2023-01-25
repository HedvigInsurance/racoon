import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode } from 'react'
import { Heading, Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import * as Accordion from './Accordion'
import { StepIcon } from './StepIcon'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  form: Form
  children(section: FormSection, index: number): ReactNode
  activeSectionId?: string
  onActiveSectionChange(sectionId: string): void
}

export const PriceCalculatorAccordion = (props: Props) => {
  const { form, children, activeSectionId, onActiveSectionChange } = props
  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()

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
            <Accordion.Content>{children(section, index)}</Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

const StyledHeading = styled(Heading)({ lineHeight: 1 })
const StyledText = styled(Text)({ lineHeight: 1 })
