import { datadogRum } from '@datadog/browser-rum'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useState } from 'react'
import {
  activeFormSectionIdAtom,
  priceCalculatorFormAtom,
  shopSessionCustomerAtom,
} from '@/components/PriceCalculator/priceCalculatorAtoms'
import { SSN_SE_SECTION_ID, SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import type { FormSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { ChangeSsnWarningDialog } from '../ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import * as Accordion from './Accordion'
import { PriceCalculatorAccordionSection } from './PriceCalculatorAccordionSection'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  children: (section: FormSection, index: number) => ReactNode
}

export const PriceCalculatorAccordion = ({ children }: Props) => {
  const shopSessionId = useShopSessionId()!
  const [activeSectionId, setActiveSectionId] = useAtom(activeFormSectionIdAtom)
  const shopSessionCustomer = useAtomValue(shopSessionCustomerAtom)
  const form = useAtomValue(priceCalculatorFormAtom)
  const router = useRouter()
  const translateLabel = useTranslateFieldLabel()
  const [showChangeSsnDialog, setShowChangeSsnDialog] = useState(false)

  const handleActiveSectionChange = useCallback(
    (sectionId: string) => {
      if (sectionId === SSN_SE_SECTION_ID && shopSessionCustomer?.ssn) {
        setShowChangeSsnDialog(true)
      } else {
        setActiveSectionId(sectionId)
      }
    },
    [setActiveSectionId, shopSessionCustomer?.ssn],
  )

  const handleAcceptChangeSsn = useCallback(() => {
    datadogRum.addAction('Cleared shopSession to change SSN in price calculator', {
      shopSessionId,
    })

    const url = new URL(window.location.href)
    if (!url.searchParams.has(OPEN_PRICE_CALCULATOR_QUERY_PARAM)) {
      url.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
    }

    router.replace(url.toString())
    setShowChangeSsnDialog(false)
  }, [shopSessionId, router])

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
          if (section.id === SSN_SE_SECTION_ID) {
            content = <SsnSeSection />
          } else {
            // TODO: Render inline instead
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
