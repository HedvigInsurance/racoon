import { usePriceIntentConfirmMutation } from '@/services/apollo/generated'
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
  onSuccess: () => void
  loading: boolean
}

export const PriceForm = ({ form, priceIntent, onSuccess, loading }: Props) => {
  const [confirmPriceIntent] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntent.id },
  })

  const [handleSubmit, loadingUpdate] = useHandleSubmitPriceForm({
    priceIntent,
    async onSuccess(updatedPriceIntent) {
      if (isFormReadyToConfirm({ form, priceIntent: updatedPriceIntent })) {
        await confirmPriceIntent()
      }
      onSuccess()
    },
  })

  const isLoading = loadingUpdate || loading

  return (
    <PriceFormAccordion form={form}>
      {(section) => (
        <PriceFormSection section={section} onSubmit={handleSubmit} loading={isLoading}>
          <FormGrid items={section.items}>
            {(field) => (
              <AutomaticField field={field} onSubmit={handleSubmit} loading={isLoading} />
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
