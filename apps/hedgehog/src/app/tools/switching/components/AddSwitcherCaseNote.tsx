'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'

import toast from 'react-hot-toast'

import { TextArea } from '@hedvig-ui'
import { Button, Dialog } from '@hedvig-ui/redesign'

import { extractFormStateErrors } from 'app/utils'
import { SubmitButton } from 'app/components/SubmitButton'

import { addSwitcherCaseNote } from '../actions'
import { PropsWithSwitcherCase } from '../page'

import { dialog } from '../SwitchingPage.css'

export function AddSwitcherCaseNote({ switcher }: PropsWithSwitcherCase) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [note, setNote] = useState('')
  const [state, formAction] = useFormState(addSwitcherCaseNote, null)

  useEffect(() => {
    if (state?.success) {
      setDialogOpen(false)
    } else {
      const errorMessages = extractFormStateErrors(state)

      errorMessages?.forEach((message) => {
        toast.error(message)
      })
    }
  }, [state])

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Add note</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <form action={formAction} className={dialog}>
          <Dialog.Title>Add note</Dialog.Title>
          <Dialog.Description>
            Add custom note on the switcher case
          </Dialog.Description>
          <TextArea
            name="note"
            data-label="Note"
            value={note}
            onChange={({ currentTarget }) => setNote(currentTarget.value)}
          />

          <input hidden name="id" defaultValue={switcher.id} />

          <SubmitButton variant="primary" disabled={!note}>
            Save
          </SubmitButton>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
