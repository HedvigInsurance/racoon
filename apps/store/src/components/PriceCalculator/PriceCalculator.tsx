import { datadogLogs } from '@datadog/browser-logs'
import { useMemo, useState } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import {
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import { Form, JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { AutomaticField } from './AutomaticField'
import { FormGrid } from './FormGrid'
import { PriceCalculatorAccordion } from './PriceCalculatorAccordion'
import { PriceCalculatorSection } from './PriceCalculatorSection'
import { useHandleSubmitPriceCalculator } from './useHandleSubmitPriceCalculator'

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  onConfirm: () => void
}

type CustomerData = {
  ssn?: string | null
  email?: string | null
}

export const PriceCalculator = (props: Props) => {
  const { priceIntent, shopSession, onConfirm } = props
  const { priceTemplate } = useProductPageContext()

  const form = useMemo(() => {
    const { ssn, email } = shopSession.customer ?? {}
    const customerData = { ssn, email }
    return setupForm({
      customer: shopSession.customer,
      suggestedData: priceIntent.suggestedData,
      template: priceTemplate,
      userData: getFormData(priceIntent, customerData),
    })
  }, [priceIntent, shopSession.customer, priceTemplate])

  const [activeSectionId, setActiveSectionId] = useState(() => {
    const firstIncompleteSection = form.sections.find(({ state }) => state !== 'valid')
    if (firstIncompleteSection) return firstIncompleteSection.id
    return form.sections[form.sections.length - 1].id
  })

  const [handleSubmit, handleSubmitSection, isLoading] = useHandleSubmitPriceCalculator({
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer: shopSession.customer,
        suggestedData: priceIntent.suggestedData,
        template: priceTemplate,
        userData: { ...customer, ...priceIntent.data },
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        onConfirm()
      } else {
        setActiveSectionId((prevSectionId) => {
          const currentSectionIndex = form.sections.findIndex(({ id }) => id === prevSectionId)
          // If section has both customer and priceIntent fields, we'll get two onSuccess callbacks
          // in unknown order. Making sure we only go forward when section fields are all filled
          if (form.sections[currentSectionIndex].state !== 'valid') {
            return form.sections[currentSectionIndex].id
          }
          const nextSection = form.sections[currentSectionIndex + 1]
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
    },
  })

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
    data: getFormData(priceIntent, customer),
    valueField: 'value',
  })
  const updatedForm = updateFormState(filledForm)
  return updatedForm.sections.every((section) => section.state === 'valid')
}

const getFormData = (priceIntent: PriceIntent, customer?: CustomerData | null): JSONData => {
  return { ...customer, ...priceIntent.data } as const
}
