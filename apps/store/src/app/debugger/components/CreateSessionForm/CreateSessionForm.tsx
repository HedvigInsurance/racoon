'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Space } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { TextField } from '@/components/TextField/TextField'
import { createCustomerSession } from 'app/debugger/actions'
import { wrapper } from './CreateSessionForm.css'

const HEDVIG_DEBUGGER_SSN = 'hedvig:debugger-ssn'

export const CreateSessionForm = () => {
  const [state, formAction] = useFormState(createCustomerSession, null)
  const [defaultSSN, setDefaultSSN] = useState<string>()

  useEffect(() => {
    const ssn = window.localStorage.getItem(HEDVIG_DEBUGGER_SSN)
    if (ssn) setDefaultSSN(ssn)
  }, [])

  const SSNError = state?.errors?.fields?.ssn

  return (
    <div className={wrapper}>
      <form action={formAction}>
        <Space y={0.25}>
          <TextField
            label="YYYYMMDDXXXX"
            key={defaultSSN}
            defaultValue={defaultSSN}
            autoFocus
            name="ssn"
            warning={!!SSNError}
            message={SSNError}
          />
          <SubmitButton>Create session</SubmitButton>
        </Space>
      </form>
    </div>
  )
}
