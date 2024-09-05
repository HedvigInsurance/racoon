'use client'
import { useFormState } from 'react-dom'
import { yStack } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { TextField } from '@/components/TextField/TextField'
import { SebDebuggerFormElement } from './constants'
import { FormResults } from './FormResults'
import { importSebLead } from './importSebLead'

export function ImportSebLeadForm() {
  const [state, importLead] = useFormState(importSebLead, {})
  return (
    <form className={yStack({ gap: 'xs' })} action={importLead}>
      <TextField
        label="Insurely session ID (sebInsurelyId)"
        name={SebDebuggerFormElement.SebInsurelyId}
        required={true}
      />
      <SubmitButton>Import SEB lead</SubmitButton>
      <FormResults formState={state} />
    </form>
  )
}
