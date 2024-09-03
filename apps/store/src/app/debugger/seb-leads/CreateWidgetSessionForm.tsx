'use client'
import { useFormState } from 'react-dom'
import { yStack } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { TextField } from '@/components/TextField/TextField'
import { SebDebuggerFormElement } from './constants'
import { createWidgetSession } from './createWidgetSession'
import { FormResults } from './FormResults'

export function CreateWidgetSessionForm() {
  const [state, formAction] = useFormState(createWidgetSession, {})
  return (
    <form className={yStack({ gap: 'xs' })} action={formAction}>
      <TextField label="Lead ID" name={SebDebuggerFormElement.LeadId} required={true} />
      <SubmitButton>Create widget session</SubmitButton>
      <FormResults formState={state} />
    </form>
  )
}
