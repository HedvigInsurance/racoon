import { useRouter } from 'next/router'
import { FormEvent, useCallback, useRef } from 'react'
import { useState } from 'react'

type TransitionState = 'idle' | 'submitting' | 'success'

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

export const useForm = <Data>({ action, method, onSuccess }: Options) => {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({ state: 'idle', errors: null })
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState({ state: 'submitting', errors: null })

    try {
      const formData = new FormData(event.currentTarget)
      // @ts-ignore doesn't know about submitter
      if (event.nativeEvent.submitter) {
        // @ts-ignore
        formData.append(event.nativeEvent.submitter.name, event.nativeEvent.submitter.value)
      }

      const response = await fetch(action, {
        method: method || 'post',
        body: formData,
        credentials: 'same-origin',
      })

      if (response.ok) {
        if (response.redirected) {
          const isSuccess = await router.push(response.url)
          if (isSuccess) {
            setFormState({ state: 'idle', errors: null })
          }
        } else {
          onSuccess?.((await response.json()) as Data)
          setFormState({ state: 'idle', errors: null })
        }
      } else {
        const errors = await response.json()
        setFormState({ state: 'idle', errors })
      }
    } catch (error) {
      setFormState({ state: 'idle', errors: { form: 'Unknown error' } })
    }
  }

  const submitForm = useCallback(() => {
    if (formRef.current?.reportValidity()) {
      formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }
  }, [])

  const formProps = {
    action,
    method,
    onSubmit: handleSubmit,
    ref: formRef,
  }

  return { ...formState, submitForm, formProps }
}
