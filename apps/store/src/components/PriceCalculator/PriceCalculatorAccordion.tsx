import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useState } from 'react'
import { SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import type { Form, FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ChangeSsnWarningDialog } from '../ChangeSsnWarningDialog/ChangeSsnWarningDialog'
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

export const PriceCalculatorAccordion = ({
  form,
  children,
  activeSectionId,
  onActiveSectionChange,
  shopSession,
}: Props) => {
  const router = useRouter()
  const translateLabel = useTranslateFieldLabel()
  const [showChangeSsnDialog, setShowChangeSsnDialog] = useState(false)

  const handleActiveSectionChange = useCallback(
    (sectionId: string) => {
      if (sectionId === SsnSeSection.sectionId && shopSession.customer?.ssn) {
        setShowChangeSsnDialog(true)
      } else {
        onActiveSectionChange(sectionId)
      }
    },
    [onActiveSectionChange, shopSession.customer?.ssn],
  )

  const handleSsnSectionCompleted = useCallback(() => {
    const nextSectionIndex =
      form.sections.findIndex((section) => section.id === SsnSeSection.sectionId) + 1
    if (!form.sections[nextSectionIndex]) {
      throw new Error(`Failed to find section after ${SsnSeSection.sectionId}`)
    }
    onActiveSectionChange(form.sections[nextSectionIndex].id)
  }, [form.sections, onActiveSectionChange])

  const handleAcceptChangeSsn = useCallback(() => {
    datadogRum.addAction('Cleared shopSession to change SSN in price calculator', {
      shopSessionId: shopSession.id,
    })

    const url = new URL(window.location.href)
    if (!url.searchParams.has(OPEN_PRICE_CALCULATOR_QUERY_PARAM)) {
      url.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
    }

    router.replace(url.toString())
    setShowChangeSsnDialog(false)
  }, [shopSession, router])

  const handleDeclineChangeSsn = useCallback(() => {
    setShowChangeSsnDialog(false)
  }, [])

  return (
    <>
      <Accordion.Root
        type="single"
        value={activeSectionId}
        onValueChange={handleActiveSectionChange}
        collapsible={true}
      >
        {form.sections.map((section, index) => {
          let content
          if (section.id === SsnSeSection.sectionId) {
            content = (
              <SsnSeSection shopSession={shopSession} onCompleted={handleSsnSectionCompleted} />
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
              tooltip={section.tooltip}
              value={section.id}
              previewFieldName={section.preview?.fieldName}
              previewLabel={section.preview?.label}
              editable={section.editable}
              items={section.items}
            >
              {content}
            </PriceCalculatorAccordionSection>
          )
        })}
      </Accordion.Root>
      <ChangeSsnWarningDialog
        open={showChangeSsnDialog}
        onAccept={handleAcceptChangeSsn}
        onDecline={handleDeclineChangeSsn}
      />
    </>
  )
}
