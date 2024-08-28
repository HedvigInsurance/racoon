'use client'

import { useState } from 'react'

import toast from 'react-hot-toast'

import { Button, Dialog } from '@hedvig-ui/redesign'

import { extractFormStateErrors } from 'app/utils'
import { SubmitButton } from 'app/components/SubmitButton'

import { PropsWithSwitcherCase } from '../page'
import { abortSwitcherCase } from '../actions'

import { dialog } from '../SwitchingPage.css'

export function AbortSwitcherCase({ switcher: { id } }: PropsWithSwitcherCase) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const submitAction = async () => {
    if (!id) {
      toast.error('id is missing')
      return
    }

    const response = await abortSwitcherCase(id)

    if (response?.success) {
      toast.success('Marked reminder sent!')
      setDialogOpen(false)
    } else {
      const errors = extractFormStateErrors(response)
      errors.forEach((message) => toast.error(message))
    }
  }

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <Button variant="danger">Abort</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <form className={dialog} action={submitAction}>
          <Dialog.Title>Abort switching?</Dialog.Title>
          <Dialog.Description>
            This will delete the pending contract.
          </Dialog.Description>
          <SubmitButton variant="danger">Abort</SubmitButton>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
