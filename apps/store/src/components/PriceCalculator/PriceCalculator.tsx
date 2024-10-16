import { datadogRum } from '@datadog/browser-rum'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { ChangeSsnWarningDialog } from '@/components/ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import { PriceCalculatorAccordionSection } from '@/components/PriceCalculator/PriceCalculatorAccordionSection'
import { SSN_SE_SECTION_ID, SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import {
  activeFormSectionIdAtom,
  GOTO_NEXT_SECTION,
  priceCalculatorFormAtom,
  shopSessionCustomerAtom,
  usePriceIntentId,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type Form } from '@/services/PriceCalculator/PriceCalculator.types'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import * as Accordion from './Accordion'
import { FetchInsuranceContainer } from './FetchInsuranceContainer'
import { FormGrid } from './FormGrid/FormGrid'
import { PriceCalculatorSection } from './PriceCalculatorSection'
import { useShowFetchInsurance } from './useFetchInsurance'
import { useHandleSubmitPriceCalculatorSection } from './useHandleSubmitPriceCalculatorSection'

type Props = {
  onConfirm: () => void
}

type CustomerData = {
  ssn?: string | null
  email?: string | null
}

export const PriceCalculator = (props: Props) => {
  const shopSessionId = useShopSessionId()
  if (shopSessionId == null) {
    throw new Error('shopSession must be ready')
  }
  const priceIntentId = usePriceIntentId()
  const priceTemplate = usePriceTemplate()
  const form = useAtomValue(priceCalculatorFormAtom)
  const shopSessionCustomer = useAtomValue(shopSessionCustomerAtom)

  const [activeSectionId, setActiveSectionId] = useAtom(activeFormSectionIdAtom)
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

  const [showChangeSsnDialog, setShowChangeSsnDialog] = useState(false)

  const showFetchInsurance = useShowFetchInsurance({ priceIntentId })

  const handleSubmitSection = useHandleSubmitPriceCalculatorSection({
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer,
        priceIntent,
        template: priceTemplate,
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        props.onConfirm()
      } else {
        if (priceIntent.externalInsurer) {
          // NOTE: We're still going to the next section underneath Insurely prompt
          showFetchInsurance()
        }
        setActiveSectionId(GOTO_NEXT_SECTION)
      }
    },
  })

  const router = useRouter()
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

  // Optimization: PriceCalculator re-renders many times (mutation state updates, etc)
  // while sections mostly stay the same
  const accordionItems = useMemo(
    () =>
      form.sections.map((section, sectionIndex) => {
        let content
        if (section.id === SSN_SE_SECTION_ID) {
          content = <SsnSeSection />
        } else {
          content = (
            <PriceCalculatorSection
              section={section}
              onSubmit={handleSubmitSection}
              last={sectionIndex === form.sections.length - 1}
            >
              <FormGrid
                items={section.items}
                // We don't want to mess up focusing for the user by setting autoFocus on the
                // first item in the form, since that would make it unintuitive to navigate our
                // site. But when the user is in the form editing, even having submitted the first
                // section, we want to set autoFocus for the next section. Hence, sectionIndex > 0
                autofocusFirst={sectionIndex > 0}
              />
            </PriceCalculatorSection>
          )
        }

        return (
          <PriceCalculatorAccordionSection
            key={section.id}
            active={section.id === activeSectionId}
            valid={section.state === 'valid'}
            title={section.title}
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
      }),
    [activeSectionId, form.sections, handleSubmitSection],
  )

  return (
    <>
      <Accordion.Root
        type="single"
        value={activeSectionId}
        onValueChange={handleActiveSectionChange}
        collapsible={true}
      >
        {accordionItems}
      </Accordion.Root>

      <ChangeSsnWarningDialog
        open={showChangeSsnDialog}
        onAccept={handleAcceptChangeSsn}
        onDecline={handleDeclineChangeSsn}
      />

      <FetchInsuranceContainer />
    </>
  )
}

type IsFormReadyToConfirmParams = {
  form: Form
  customer?: CustomerData | null
  priceIntent: PriceIntent
}

const isFormReadyToConfirm = ({ form, customer, priceIntent }: IsFormReadyToConfirmParams) => {
  const filledForm = prefillData({
    form,
    data: { ...customer, ...priceIntent.data },
    valueField: 'value',
  })
  const updatedForm = updateFormState(filledForm)
  return updatedForm.sections.every((section) => section.state === 'valid')
}
