'use client'

import { useState } from 'react'

import toast from 'react-hot-toast'

import { Button, Dialog } from '@hedvig-ui/redesign'

import { extractFormStateErrors } from 'app/utils'

import { SubmitButton } from 'app/components/SubmitButton'

import { PropsWithSwitcherCase } from '../page'

import { markSwitcherCaseAsReminded } from '../actions'

import { dialog } from '../SwitchingPage.css'

export function MarkAsReminded({ switcher: { id } }: PropsWithSwitcherCase) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const submitAction = async () => {
    if (!id) {
      toast.error('id is missing')
      return
    }

    const response = await markSwitcherCaseAsReminded(id)

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
        <Button variant="secondary">Mark as reminded</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <form className={dialog} action={submitAction}>
          <Dialog.Title>Mark as reminded?</Dialog.Title>
          <Dialog.Description>
            Flag the switcher case as manually reminded
          </Dialog.Description>
          <SubmitButton variant="primary">Confirm</SubmitButton>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
