'use client'

import { createCustomerSession } from 'app/debugger/actions'
import { useEffect, useState } from 'react'
import { Space } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { TextField } from '@/components/TextField/TextField'
import { wrapper } from './CreateSessionForm.css'

const HEDVIG_DEBUGGER_SSN = 'hedvig:debugger-ssn'

export const CreateSessionForm = () => {
  const [defaultSsn, setDefaultSsn] = useState<string | undefined>(undefined)

  useEffect(() => {
    const ssn = window.localStorage.getItem(HEDVIG_DEBUGGER_SSN)
    if (ssn) setDefaultSsn(ssn)
  }, [])

  return (
    <div className={wrapper}>
      <form action={createCustomerSession}>
        <Space y={0.25}>
          <TextField
            label="YYYYMMDDXXXX"
            key={defaultSsn}
            defaultValue={defaultSsn}
            autoFocus
            required
            name="ssn"
          />
          <SubmitButton>Create session</SubmitButton>
        </Space>
      </form>
    </div>
  )
}
