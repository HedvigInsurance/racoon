'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { type FormEventHandler, type PropsWithChildren, type ReactNode } from 'react'
import { Heading, yStack } from 'ui'
import { SSN_SE_SECTION_ID, SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { useHandleSubmitPriceCalculatorSection } from '@/components/PriceCalculator/useHandleSubmitPriceCalculatorSection'
import { useTranslateFieldLabel } from '@/components/PriceCalculator/useTranslateFieldLabel'
import {
  activeFormSectionIdAtom,
  GOTO_NEXT_SECTION,
  priceCalculatorFormAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { FormGridNew } from '@/features/priceCalculator/FormGridNew'
import { SectionPreview } from '@/features/priceCalculator/SectionPreview'
import {
  deserializeField,
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  type Form,
  type FormSection,
  type JSONData,
} from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

type InsuranceDataFormProps = {
  onSubmitSuccessAndReadyToConfirm: () => void
}

export function InsuranceDataForm(props: InsuranceDataFormProps) {
  const shopSessionId = useShopSessionId()
  if (shopSessionId == null) {
    throw new Error('shopSession must be ready')
  }
  const form = useAtomValue(priceCalculatorFormAtom)
  const [activeSectionId] = useAtom(activeFormSectionIdAtom)
  const translateLabel = useTranslateFieldLabel()
  const sections = form.sections.map((section) => {
    let sectionBody: ReactNode
    if (section.id !== activeSectionId) {
      // No preview needed for sections that are not yet touched
      if (section.state === 'initial') {
        return null
      }
      sectionBody = <SectionPreview section={section} />
    } else if (section.id === SSN_SE_SECTION_ID) {
      sectionBody = <SsnSeSection />
    } else {
      sectionBody = (
        <InsuranceDataSection
          section={section}
          onSubmitSuccessAndReadyToConfirm={props.onSubmitSuccessAndReadyToConfirm}
        />
      )
    }
    return (
      <div key={section.id}>
        <SectionTitle>{translateLabel(section.title)}</SectionTitle>
        {sectionBody}
      </div>
    )
  })
  return <div className={yStack({ gap: 'lg' })}>{sections}</div>
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <Heading as="h2" variant="standard.24">
      {children}
    </Heading>
  )
}

// TODO
// - do we need autofocus on first field?
// - create customer-independent submit handler
function InsuranceDataSection({
  section,
  onSubmitSuccessAndReadyToConfirm,
}: { section: FormSection } & InsuranceDataFormProps) {
  const priceTemplate = usePriceTemplate()
  const submitPriceCalculatorSection = useHandleSubmitPriceCalculatorSection({
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer,
        priceIntent,
        template: priceTemplate,
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        onSubmitSuccessAndReadyToConfirm()
        return
      }

      if (priceIntent.warning) {
        // TODO: restore warning handling
        // showPriceIntentWarning(true)
        // datadogRum.addAction('Show PriceIntent Warning')
      } else {
        goToNextSection()
      }

      if (priceIntent.externalInsurer) {
        // FIXME: restore Insurely support
        // NOTE: We're still going to the next section underneath Insurely prompt
        // showFetchInsurance()
      }
    },
  })

  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const goToNextSection = () => {
    setActiveSectionId(GOTO_NEXT_SECTION)
  }
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const jsonData = formDataToJson(new FormData(event.currentTarget), section.items)
    submitPriceCalculatorSection(jsonData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGridNew items={section.items} submitLabel={section.submitLabel} />
    </form>
  )
}

// TODO: don't update customer data in generic section
type IsFormReadyToConfirmParams = {
  form: Form
  customer?: CustomerData | null
  priceIntent: PriceIntent
}
type CustomerData = {
  ssn?: string | null
  email?: string | null
}

export const isFormReadyToConfirm = ({
  form,
  customer,
  priceIntent,
}: IsFormReadyToConfirmParams) => {
  const filledForm = prefillData({
    form,
    data: { ...customer, ...priceIntent.data },
    valueField: 'value',
  })
  const updatedForm = updateFormState(filledForm)
  return updatedForm.sections.every((section) => section.state === 'valid')
}

const formDataToJson = (formData: FormData, sectionItems: FormSection['items']) => {
  const result: JSONData = {}

  for (const item of sectionItems) {
    const deserializedFieldValue = deserializeField(item.field, formData)
    if (deserializedFieldValue !== undefined) {
      result[item.field.name] = deserializedFieldValue
    }
  }
  return result
}
