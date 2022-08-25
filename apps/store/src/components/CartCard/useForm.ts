import { FormEvent, useState } from 'react'

type FormState = 'idle' | 'submitting'

type Options = {
  onComplete?: () => void
}

export const useForm = ({ onComplete }: Options = {}) => {
  const [formState, setFormState] = useState<FormState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState('submitting')

    try {
      const response = await fetch(event.currentTarget.action, {
        method: event.currentTarget.method,
        // @ts-expect-error only valid if we are submitting files in the form
        body: new URLSearchParams(new FormData(event.currentTarget)),
        credentials: 'same-origin',
      })

      if (response.status !== 302) {
        throw new Error(`Form request failed with ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Unable to submit form')
      console.error(error)
    } finally {
      onComplete?.()
      setFormState('idle')
    }
  }

  return { state: formState, formProps: { onSubmit: handleSubmit } }
}
