import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useSetAtom } from 'jotai'
import { useMemo, useState } from 'react'
import {
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type Template, type Form } from '@/services/PriceCalculator/PriceCalculator.types'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { AutomaticField } from './AutomaticField'
import { FetchInsurance } from './FetchInsurance'
import { FetchInsuranceContainer } from './FetchInsuranceContainer'
import { FormGrid } from './FormGrid/FormGrid'
import { PriceCalculatorAccordion } from './PriceCalculatorAccordion'
import { PriceCalculatorSection } from './PriceCalculatorSection'
import { useShowFetchInsurance } from './useFetchInsurance'
import { useHandleSubmitPriceCalculator } from './useHandleSubmitPriceCalculator'
import { showPriceIntentWarningAtom } from './Warning/showPriceIntentWarningAtom'
import { Warning } from './Warning/Warning'

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  priceTemplate: Template
  onConfirm: () => void
}

type CustomerData = {
  ssn?: string | null
  email?: string | null
}

export const PriceCalculator = (props: Props) => {
  const { priceIntent, shopSession, onConfirm, priceTemplate } = props

  const form = useMemo(() => {
    return setupForm({
      customer: shopSession.customer,
      priceIntent,
      template: priceTemplate,
    })
  }, [priceIntent, shopSession.customer, priceTemplate])

  const [activeSectionId, setActiveSectionId] = useState(() => {
    const firstIncompleteSection = form.sections.find(({ state }) => state !== 'valid')
    if (firstIncompleteSection) return firstIncompleteSection.id
    return form.sections[form.sections.length - 1].id
  })

  const showFetchInsurance = useShowFetchInsurance({ priceIntentId: priceIntent.id })
  const showPriceIntentWarning = useSetAtom(showPriceIntentWarningAtom)
  const [handleSubmit, handleSubmitSection, isLoading] = useHandleSubmitPriceCalculator({
    shopSession,
    priceIntent,
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer,
        priceIntent,
        template: priceTemplate,
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        onConfirm()
      } else {
        if (priceIntent.warning) {
          showPriceIntentWarning(true)
          datadogRum.addAction('Show PriceIntent Warning')
        }
        if (priceIntent.externalInsurer) showFetchInsurance()

        // If we show a warning, prevent the user from going to the
        // next section without interacting with the warning dialog
        if (!priceIntent.warning) {
          goToNextSection()
        }
      }
    },
  })

  const goToNextSection = () => {
    setActiveSectionId((prevSectionId) => {
      const currentSectionIndex = form.sections.findIndex(({ id }) => id === prevSectionId)
      // If section has both customer and priceIntent fields, we'll get two onSuccess callbacks
      // in unknown order. Making sure we only go forward when section fields are all filled
      if (form.sections[currentSectionIndex].state !== 'valid') {
        return form.sections[currentSectionIndex].id
      }
      const nextSection = form.sections[currentSectionIndex + 1]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (nextSection) {
        return nextSection.id
      } else {
        datadogLogs.logger.error('Failed to find next section', {
          prevSectionId,
          templateName: priceTemplate.name,
          priceIntentId: priceIntent.id,
        })
        return prevSectionId
      }
    })
  }

  return (
    <>
      <PriceCalculatorAccordion
        activeSectionId={activeSectionId}
        form={form}
        shopSession={shopSession}
        onActiveSectionChange={setActiveSectionId}
      >
        {(section, sectionIndex) => (
          <PriceCalculatorSection
            section={section}
            onSubmit={handleSubmitSection}
            loading={isLoading}
            last={sectionIndex === form.sections.length - 1}
          >
            <FormGrid items={section.items}>
              {(field, index) => (
                <AutomaticField
                  field={field}
                  onSubmit={handleSubmit}
                  loading={isLoading}
                  priceIntent={priceIntent}
                  // We don't want to mess up focusing for the user by setting autoFocus on the
                  // first item in the form, since that would make it unintuitive to navigate our
                  // site. But when the user is in the form editing, even having submitted the first
                  // section, we want to set autoFocus for the next section. Hence sectionIndex > 0
                  autoFocus={sectionIndex > 0 && index === 0}
                />
              )}
            </FormGrid>
          </PriceCalculatorSection>
        )}
      </PriceCalculatorAccordion>

      {priceIntent.warning && (
        <Warning priceIntentWarning={priceIntent.warning} onConfirm={goToNextSection} />
      )}

      <FetchInsuranceContainer priceIntent={priceIntent}>
        {({ externalInsurer, insurely }) => (
          <FetchInsurance
            shopSession={shopSession}
            priceIntentId={priceIntent.id}
            externalInsurer={externalInsurer}
            insurely={insurely}
            productName={priceIntent.product.name}
          />
        )}
      </FetchInsuranceContainer>
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
