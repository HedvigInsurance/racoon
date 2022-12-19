import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Heading } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { Text } from '../Text/Text'
import * as Accordion from './Accordion'
import { StepIcon } from './StepIcon'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  form: Form
  children(section: FormSection, index: number): ReactNode
}

export const PriceCalculatorAccordion = ({ form, children }: Props) => {
  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()
  const [activeSectionId, onActiveSectionChange] = useActiveFormSection(form)

  return (
    <Accordion.Root
      type="single"
      value={activeSectionId}
      onValueChange={onActiveSectionChange}
      collapsible
    >
      {form.sections.map((section, index) => {
        const isMuted = section.state !== 'valid' && section.id !== activeSectionId
        const stepIconState = section.state === 'valid' ? 'muted' : 'outline'

        return (
          <Accordion.Item key={section.id} value={section.id}>
            <Accordion.Header>
              <SpaceFlex space={0.5} align="center">
                <StepIcon state={section.id === activeSectionId ? 'filled' : stepIconState} />
                <StyledHeading as="h3" variant="standard.18" muted={isMuted}>
                  {translateLabel(section.title)}
                </StyledHeading>
              </SpaceFlex>
              {section.state === 'valid' && (
                <Accordion.Trigger>
                  <StyledText size="l" color="textPrimary">
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

type StyledHeadingProps = { muted: boolean }

const StyledHeading = styled(Heading)<StyledHeadingProps>(({ theme, muted }) => ({
  color: muted ? theme.colors.gray600 : theme.colors.gray900,
  lineHeight: 1,
}))

const StyledText = styled(Text)({ lineHeight: 1 })
