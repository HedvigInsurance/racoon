'use client'

import { useEffect, useState } from 'react'
import { Button, Space } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { create } from './actions'

const HEDVIG_DEBUGGER_SSN = 'hedvig:debugger-ssn'

export const CreateSessionForm = () => {
  const [defaultSsn, setDefaultSsn] = useState<string | undefined>(undefined)

  useEffect(() => {
    const ssn = window.localStorage.getItem(HEDVIG_DEBUGGER_SSN)
    if (ssn) setDefaultSsn(ssn)
  }, [])

  return (
    <form action={create}>
      <Space y={0.25}>
        <TextField
          label="YYYYMMDDXXXX"
          key={defaultSsn}
          defaultValue={defaultSsn}
          autoFocus
          name="ssn"
        />
        <Button>Create session</Button>
      </Space>
    </form>
  )
}
