'use client'

import { datadogRum } from '@datadog/browser-rum'
import { clsx } from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, type ReactNode } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Heading, yStack } from 'ui'
import { FetchInsuranceContainer } from '@/components/PriceCalculator/FetchInsuranceContainer'
import { PriceIntentWarningDialog } from '@/components/PriceCalculator/PriceIntentWarningDialog/PriceIntentWarningDialog'
import { showPriceIntentWarningAtom } from '@/components/PriceCalculator/PriceIntentWarningDialog/showPriceIntentWarningAtom'
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
import { EditSsnWarningContainer } from '@/features/priceCalculator/EditSsnWarningContainer'
import { FormGridNew } from '@/features/priceCalculator/FormGridNew'
import { gdprLink } from '@/features/priceCalculator/InsuranceDataForm.css'
import { priceCalculatorStepAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { SectionPreview } from '@/features/priceCalculator/SectionPreview'
import { useConfirmPriceIntent } from '@/features/priceCalculator/useConfirmPriceIntent'
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
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export function InsuranceDataForm() {
  const shopSessionId = useShopSessionId()
  if (shopSessionId == null) {
    throw new Error('shopSession must be ready')
  }
  const locale = useRoutingLocale()
  const { t } = useTranslation('purchase-form')
  const form = useAtomValue(priceCalculatorFormAtom)
  const activeSectionId = useAtomValue(activeFormSectionIdAtom)
  const step = useAtomValue(priceCalculatorStepAtom)
  const sections = form.sections.map((section, index) => {
    if (step !== 'fillForm' || section.id !== activeSectionId) {
      // No preview needed for sections that are not yet touched
      if (section.state === 'initial') {
        return null
      }
      return <SectionPreview key={section.id} section={section} />
    }

    let sectionBody: ReactNode
    let sectionStyle = {}
    if (section.id === SSN_SE_SECTION_ID) {
      sectionBody = <SsnSeSection />
    } else {
      sectionStyle = { marginTop: '3.75rem' }
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
      <div key={section.id} className={yStack({ gap: 'xl' })} style={sectionStyle}>
        <SectionTitle section={section} />
        {sectionBody}
      </div>
    )
  })

  return (
    <>
      <div className={yStack({ gap: 'xs' })}>{sections}</div>
      <EditSsnWarningContainer />
      <PriceIntentWarningDialog />
      <FetchInsuranceContainer />
    </>
  )
}

function SectionTitle({ section }: { section: FormSection }) {
  const translateLabel = useTranslateFieldLabel()
  return (
    <div>
      <Heading as="h2" variant="standard.24">
        {translateLabel(section.title)}
      </Heading>
      {section.subtitle != null && (
        <Heading as="h3" variant="standard.24" color="textSecondary">
          {translateLabel(section.subtitle)}
        </Heading>
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

  const showPriceIntentWarning = useSetAtom(showPriceIntentWarningAtom)
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

      if (priceIntent.warning) {
        // SIDE EFFECTS: This solution is simple, but comes with quirks
        // 1. As soon as warning appears, we'll start showing it when non-final form section is submitted
        //    Currently, it's OK because we only have warnings for car not owned by current customer,
        //    and it appears when submitting second-to-last section of insurance data form
        // 2. Warning will be shown again if user has dismissed it, then went to edit the same form section
        //    and submitted it - minor UX inconvenience we'll not prioritize for now
        //
        // If we ever want better model, we need to remember which warning(s) we had shown for priceIntent
        showPriceIntentWarning(true)
        datadogRum.addAction('Show PriceIntent Warning')
      } else {
        setActiveSectionId(GOTO_NEXT_SECTION)
      }
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
