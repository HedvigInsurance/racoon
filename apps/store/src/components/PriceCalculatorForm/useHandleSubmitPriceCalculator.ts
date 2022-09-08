import { FormEventHandler } from 'react'
import {
  usePriceIntentConfirmMutation,
  usePriceIntentDataUpdateMutation,
} from '@/services/apollo/generated'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { useRefreshData } from '@/utils/useRefreshData'
import { prepopulateFormTemplate } from './PriceCalculatorForm.helpers'

type Params = {
  priceIntentId: string
  formTemplate: FormTemplate
}

export const useHandleSubmitPriceCalculatorForm = ({ formTemplate, priceIntentId }: Params) => {
  const [refreshData, loadingData] = useRefreshData()
  const [updateData, { loading: loadingUpdate }] = usePriceIntentDataUpdateMutation()

  const [confirmPriceIntent, { loading: loadingConfirm }] = usePriceIntentConfirmMutation({
    variables: { priceIntentId },
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

    // Refresh route since data is fetched server-side (product page)
    await refreshData()
  }

  const loading = loadingData || loadingConfirm || loadingUpdate
  return [handleSubmit, loading] as const
}
