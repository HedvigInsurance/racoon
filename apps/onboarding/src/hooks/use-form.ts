import type { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'

type TransitionState = 'idle' | 'submitting'

type FormState = {
  state: TransitionState
  errors: Record<string, string> | null
}

type SuccessFunction<Data = any> = (_data: Data) => void

type Options = {
  action: string
  method?: 'put' | 'post' | 'patch' | 'delete'
  onSuccess?: SuccessFunction
}

export const useForm = <Data,>({ action, method, onSuccess }: Options) => {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({ state: 'idle', errors: null })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState({ state: 'submitting', errors: null })

    try {
      const response = await fetch(action, {
        method: method || 'post',
        body: new FormData(event.currentTarget),
        credentials: 'same-origin',
      })

      if (response.ok) {
        if (response.redirected) {
          router.push(response.url)
        } else {
          onSuccess?.((await response.json()) as Data)
          setFormState({ state: 'idle', errors: null })
        }
      } else {
        const errors = await response.json()
        setFormState({ state: 'idle', errors })
      }
    } catch (error) {
      console.error(error)
      setFormState({ state: 'idle', errors: { form: 'Error' } })
    }
  }

  const formProps = {
    action,
    method,
    onSubmit: handleSubmit,
  }

  return { ...formState, formProps }
}
