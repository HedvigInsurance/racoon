'use client'

import { createCustomerSession } from 'app/debugger/actions'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Space } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
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
          <PersonalNumberField
            defaultValue={defaultSSN}
            key={defaultSSN}
            autoFocus
            name="ssn"
            label="SSN (YYMMDD-XXXX)"
            required={true}
            warning={!!SSNError}
            message={SSNError}
          />
          <SubmitButton>Create session</SubmitButton>
        </Space>
      </form>
    </div>
  )
}
