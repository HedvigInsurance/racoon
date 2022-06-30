import { useEffect, useState } from 'react'
import * as PriceCalculatorService from '@/services/mockPriceCalculatorService'

type OnSubmitParams = { data: Record<string, string> }

export const usePriceCalculator = () => {
  const [form, setForm] = useState<PriceCalculatorService.QuoteForm>()

  useEffect(() => {
    const onPageLoad = async () => {
      setForm(await PriceCalculatorService.create({ product: 'apartment' }))
    }

    if (document.readyState === 'complete') {
      onPageLoad()
    } else {
      window.addEventListener('load', onPageLoad)
      return () => window.removeEventListener('load', onPageLoad)
    }
  }, [])

  if (!form) return null

  const onSubmit = async (params: OnSubmitParams) => {
    await PriceCalculatorService.addData({ id: form.id, data: params.data })
    const newForm = await PriceCalculatorService.fetch({ id: form.id })
    if (newForm) {
      setForm(newForm)
    } else {
      throw new Error('Form not found')
    }
  }

  return { quoteForm: form, onSubmit }
}
