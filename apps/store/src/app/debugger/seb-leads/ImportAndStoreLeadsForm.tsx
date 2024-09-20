'use client'
import { useFormState } from 'react-dom'
import { yStack } from 'ui'
import { SebDebuggerFormElement } from '@/app/debugger/seb-leads/constants'
import { importAnsSendLeads } from '@/app/debugger/seb-leads/importAndStoreLeads'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { TextField } from '@/components/TextField/TextField'
import { FormResults } from './FormResults'

export function ImportAndStoreLeadsForm() {
  const today = new Date().toISOString()
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()

  const [state, formAction] = useFormState(importAnsSendLeads, {
    fields: {
      fromDate: lastWeek,
      toDate: today,
    },
  })
  return (
    <form className={yStack({ gap: 'xs' })} action={formAction}>
      <TextField
        label={SebDebuggerFormElement.FromDate}
        name={SebDebuggerFormElement.FromDate}
        defaultValue={state?.fields?.fromDate}
        type={'date'}
      />
      <TextField
        label={SebDebuggerFormElement.ToDate}
        name={SebDebuggerFormElement.ToDate}
        defaultValue={state?.fields?.toDate}
        type={'date'}
      />
      <SubmitButton>Import all leads between from and to date </SubmitButton>
      <FormResults formState={state} />
    </form>
  )
}
