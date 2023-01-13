import { datadogLogs } from '@datadog/browser-logs'
import { useMemo, useState } from 'react'
import {
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import { Form, Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { AutomaticField } from './AutomaticField'
import { FormGrid } from './FormGrid'
import { PriceCalculatorAccordion } from './PriceCalculatorAccordion'
import { PriceCalculatorSection } from './PriceCalculatorSection'
import { useHandleSubmitPriceCalculator } from './useHandleSubmitPriceCalculator'

type Props = {
  shopSession: ShopSession
  priceIntent: PriceIntent
  priceTemplate: Template
  onConfirm: () => void
}

export const PriceCalculator = (props: Props) => {
  const { shopSession, priceTemplate, priceIntent, onConfirm } = props

  const form = useMemo(() => {
    const userData = { ...priceIntent.data, ...shopSession.customer }
    return setupForm(priceTemplate, userData, priceIntent.suggestedData)
  }, [priceTemplate, priceIntent, shopSession.customer])

  const [activeSectionId, setActiveSectionId] = useState(() => {
    const firstIncompleteSection = form.sections.find(({ state }) => state !== 'valid')
    if (firstIncompleteSection) return firstIncompleteSection.id
    return form.sections[form.sections.length - 1].id
  })

  const [handleSubmit, handleSubmitSection, isLoading] = useHandleSubmitPriceCalculator({
    shopSessionId: shopSession.id,
    priceIntent,
    onSuccess(updatedPriceIntent) {
      if (isFormReadyToConfirm({ form, priceIntent: updatedPriceIntent })) {
        onConfirm()
      } else {
        setActiveSectionId((prevSectionId) => {
          const currentSectionIndex = form.sections.findIndex(({ id }) => id === prevSectionId)
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
    <PriceCalculatorAccordion
      form={form}
      activeSectionId={activeSectionId}
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
  )
}

type IsFormReadyToConfirmParams = {
  form: Form
  priceIntent: PriceIntent
}

const isFormReadyToConfirm = ({ form, priceIntent }: IsFormReadyToConfirmParams) => {
  const filledForm = prefillData({ form, data: priceIntent.data, valueField: 'value' })
  const updatedForm = updateFormState(filledForm)
  return updatedForm.sections.every((section) => section.state === 'valid')
}
