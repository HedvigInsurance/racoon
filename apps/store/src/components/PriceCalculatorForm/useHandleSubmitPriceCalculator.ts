import { FormEventHandler } from 'react'
import {
  usePriceIntentConfirmMutation,
  usePriceIntentDataUpdateMutation,
} from '@/services/apollo/generated'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { prepopulateFormTemplate } from './PriceCalculatorForm.helpers'

type Params = {
  priceIntentId: string
  formTemplate: FormTemplate
}

export const useHandleSubmitPriceCalculatorForm = ({ formTemplate, priceIntentId }: Params) => {
  const [updateData, updateResult] = usePriceIntentDataUpdateMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const [confirmPriceIntent, confirmResult] = usePriceIntentConfirmMutation({
    variables: { priceIntentId },
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = await updateData({ variables: { priceIntentId, data } })

    if (result.data && result.data.priceIntentDataUpdate.priceIntent) {
      const updatedData = result.data.priceIntentDataUpdate.priceIntent.data
      const populatedTemplate = prepopulateFormTemplate(formTemplate, updatedData)

      if (populatedTemplate.sections.every((section) => section.state === 'VALID')) {
        await confirmPriceIntent()
      }
    }
  }

  const result = confirmResult.loading ? confirmResult : updateResult
  return [handleSubmit, result] as const
}
