import { datadogLogs } from '@datadog/browser-logs'
import {
  PriceIntentFragmentFragment,
  usePriceIntentConfirmMutation,
} from '@/services/apollo/generated'
import { prefillData, updateFormState } from '@/services/PriceForm/PriceForm.helpers'
import { Form } from '@/services/PriceForm/PriceForm.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { AutomaticField } from './AutomaticField'
import { FormGrid } from './FormGrid'
import { PriceFormAccordion } from './PriceFormAccordion'
import { PriceFormSection } from './PriceFormSection'
import { useHandleSubmitPriceForm } from './useHandleSubmitPriceForm'

type Props = {
  priceIntent: PriceIntent
  form: Form
  onSuccess: (priceIntent: PriceIntentFragmentFragment) => void
  onUpdated: (priceIntent: PriceIntentFragmentFragment) => void
  loading: boolean
}

export const PriceForm = ({ form, priceIntent, onUpdated, onSuccess, loading }: Props) => {
  const [confirmPriceIntent, { loading: loadingConfirm }] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntent.id },
    onCompleted(data) {
      const updatedPriceIntent = data.priceIntentConfirm.priceIntent
      if (updatedPriceIntent) {
        onSuccess(updatedPriceIntent)
      }
    },
    onError(error) {
      datadogLogs.logger.error('Failed to confirm price intent', {
        error,
        priceIntentId: priceIntent.id,
      })
    },
  })

  const [handleSubmit, loadingUpdate] = useHandleSubmitPriceForm({
    priceIntent,
    onSuccess(updatedPriceIntent) {
      if (isFormReadyToConfirm({ form, priceIntent: updatedPriceIntent })) {
        confirmPriceIntent()
      }
      onUpdated(updatedPriceIntent)
    },
  })

  const isLoading = loadingUpdate || loadingConfirm || loading

  return (
    <PriceFormAccordion form={form}>
      {(section, sectionIndex) => (
        <PriceFormSection section={section} onSubmit={handleSubmit} loading={isLoading}>
          <FormGrid items={section.items}>
            {(field, index) => (
              <AutomaticField
                field={field}
                onSubmit={handleSubmit}
                loading={isLoading}
                // We don't want to mess up focusing for the user by setting autoFocus on the
                // first item in the form, since that would make it unintuitive to navigate our
                // site. But when the user is in the form editing, even having submitted the first
                // section, we want to set autoFocus for the next section. Hence sectionIndex > 0
                autoFocus={sectionIndex > 0 && index === 0}
              />
            )}
          </FormGrid>
        </PriceFormSection>
      )}
    </PriceFormAccordion>
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
