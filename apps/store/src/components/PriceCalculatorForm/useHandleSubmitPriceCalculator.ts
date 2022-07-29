import { FormEvent, useState } from 'react'
import useRouterRefresh from '@/hooks/useRouterRefresh'
import { PageLink } from '@/lib/PageLink'

type Params = {
  productSlug: string
}

export const useHandleSubmitPriceCalculatorForm = ({ productSlug }: Params) => {
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const refreshData = useRouterRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    const formData = new FormData(event.currentTarget)
    const { intent, ...data } = Object.fromEntries(formData.entries())

    const url = PageLink.apiPriceProduct({
      productSlug,
      intent: intent === 'confirm' ? 'confirm' : 'update',
    })

    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      await refreshData()
    } finally {
      setStatus('idle')
    }
  }

  return { status, handleSubmit }
}
