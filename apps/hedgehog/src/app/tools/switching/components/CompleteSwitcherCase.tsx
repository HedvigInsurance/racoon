'use client'

import { useState } from 'react'

import toast from 'react-hot-toast'

import { extractErrorMessage } from '@hedvig-ui'
import { Button, Dialog, TextDatePicker } from '@hedvig-ui/redesign'

import { completeSwitcherCase } from '../actions'

import { PropsWithSwitcherCase } from '../page'

import { dialog } from '../SwitchingPage.css'

export function CompleteSwitcherCase({ switcher }: PropsWithSwitcherCase) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(
    new Date().toISOString(),
  )

  const handleCompletion = () => {
    if (!startDate) {
      return
    }

    toast.promise(
      completeSwitcherCase({
        id: switcher.id,
        startDate,
      }).then(() => setDialogOpen(false)),
      {
        loading: 'Activating insurance...',
        success: 'Switcher contract activated!',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <Button variant="primary">Complete</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <div className={dialog}>
          <Dialog.Title>Complete</Dialog.Title>
          <Dialog.Description>
            Choose a start date of the contract, typically matching the end date
            of their current insurance. This will activate the pending contract.
          </Dialog.Description>

          <TextDatePicker
            value={startDate}
            onChange={setStartDate}
            pickerFloating={false}
          />
          <Button
            variant="primary"
            disabled={!startDate}
            onClick={handleCompletion}
          >
            Activate
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
