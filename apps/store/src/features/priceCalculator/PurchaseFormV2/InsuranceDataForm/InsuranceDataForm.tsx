'use client'

import { clsx } from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, type ReactNode } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { yStack } from 'ui'
import { FetchInsuranceContainer } from '@/components/PriceCalculator/FetchInsuranceContainer'
import { SSN_SE_SECTION_ID, SsnSeSection } from '@/components/PriceCalculator/SsnSeSection'
import { useHandleSubmitPriceCalculatorSection } from '@/components/PriceCalculator/useHandleSubmitPriceCalculatorSection'
import { useTranslateFieldLabel } from '@/components/PriceCalculator/useTranslateFieldLabel'
import {
  activeFormSectionIdAtom,
  GOTO_NEXT_SECTION,
  priceCalculatorFormAtom,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { TextLink } from '@/components/TextLink/TextLink'
import { priceCalculatorStepAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { EditSsnWarningContainer } from '@/features/priceCalculator/PurchaseFormV2/InsuranceDataForm/EditSsnWarningContainer'
import { FormGridNew } from '@/features/priceCalculator/PurchaseFormV2/InsuranceDataForm/FormGridNew/FormGridNew'
import {
  ssnSectionWrapper,
  gdprLink,
} from '@/features/priceCalculator/PurchaseFormV2/InsuranceDataForm/InsuranceDataForm.css'
import { useConfirmPriceIntent } from '@/features/priceCalculator/PurchaseFormV2/InsuranceDataForm/useConfirmPriceIntent'
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
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { SectionTitle, SectionSubtitle } from '../SectionHeading'
import { SectionNavigation } from './SectionNavigation'

export function InsuranceDataForm({ className }: { className?: string }) {
  const locale = useRoutingLocale()
  const { t } = useTranslation('purchase-form')

  const form = useAtomValue(priceCalculatorFormAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const step = useAtomValue(priceCalculatorStepAtom)

  const sections = form.sections.map((section, index) => {
    if (step !== 'fillForm' || section.id !== activeSectionId) {
      // Skip rendering inactive sections
      return null
    }

    let sectionBody: ReactNode
    const isSsnSection = section.id === SSN_SE_SECTION_ID
    if (isSsnSection) {
      sectionBody = <SsnSeSection className={yStack({ gap: 'lg' })} />
    } else {
      const isLast = index === form.sections.length - 1
      sectionBody = (
        <>
          <InsuranceDataSection section={section} />
          {isLast && (
            <TextLink
              href={PageLink.privacyPolicy({ locale })}
              className={clsx(sprinkles({ alignSelf: 'center' }), gdprLink)}
              target="_blank"
              size="xs"
            >
              {t('GDPR_LINK_BEFORE_OFFER')}
            </TextLink>
          )}
        </>
      )
    }
    return (
      <div
        key={section.id}
        className={clsx(yStack({ gap: 'lg' }), isSsnSection && ssnSectionWrapper, className)}
      >
        {!isSsnSection && <SectionNavigation />}

        <div className={yStack({ gap: 'lg' })}>
          <SectionHeadings section={section} />
          {sectionBody}
        </div>
      </div>
    )
  })

  return (
    <>
      {sections}
      <EditSsnWarningContainer />
      <FetchInsuranceContainer />
    </>
  )
}

function SectionHeadings({ section }: { section: FormSection }) {
  const translateLabel = useTranslateFieldLabel()
  return (
    <div>
      <SectionTitle>{translateLabel(section.title)}</SectionTitle>
      {section.subtitle != null && (
        <SectionSubtitle>{translateLabel(section.subtitle)}</SectionSubtitle>
      )}
    </div>
  )
}

type InsuranceDataSectionProps = {
  section: FormSection
}

// TODO
// - do we need autofocus on first field?
function InsuranceDataSection({ section }: InsuranceDataSectionProps) {
  const priceTemplate = usePriceTemplate()
  const setStep = useSetAtom(priceCalculatorStepAtom)

  const confirmPriceIntent = useConfirmPriceIntent()

  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)

  const submitPriceCalculatorSection = useHandleSubmitPriceCalculatorSection({
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer,
        priceIntent,
        template: priceTemplate,
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        setStep('calculatingPrice')
        confirmPriceIntent()
        return
      }

      setActiveSectionId(GOTO_NEXT_SECTION)
    },
  })

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
