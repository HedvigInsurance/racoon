import { FormEvent, useState } from 'react'
import { PageLink } from '@/lib/PageLink'

type Params = {
  onSuccess: () => void
}

export const useHandleSubmitCartReview = ({ onSuccess }: Params) => {
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === 'submitting') return

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    setStatus('submitting')

    try {
      const response = await fetch(PageLink.apiCartReview(), {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        onSuccess()
      }
    } finally {
      setStatus('idle')
    }
  }

  return [handleSubmit, status] as const
}
