import type { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'

type FormState = { submission: boolean; errors: Record<string, string> | null }

type SuccessFunction<Data = any> = (_data: Data) => void

type Options = {
  action: string
  method?: 'put' | 'post' | 'patch' | 'delete'
  onSuccess?: SuccessFunction
}

export const useForm = <Data,>({ action, method, onSuccess }: Options) => {
  const router = useRouter()
  const [{ submission, errors }, setFormState] = useState<FormState>({
    submission: false,
    errors: null,
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState({ submission: true, errors: null })

    const response = await fetch(action, {
      method: method || 'post',
      body: new FormData(event.currentTarget),
    })

    if (response.ok) {
      if (response.redirected) {
        router.push(response.url)
      } else {
        onSuccess?.((await response.json()) as Data)
        setFormState({ submission: false, errors: null })
      }
    } else {
      const { errors } = await response.json()
      setFormState({ submission: false, errors })
    }
  }

  const formProps = {
    action,
    method,
    onSubmit: handleSubmit,
  }

  return { submission, errors, formProps }
}
