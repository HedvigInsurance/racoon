import styled from '@emotion/styled'
import { useState } from 'react'
import { Dialog, theme } from 'ui'
import { PriceIntentWarning } from '@/services/graphql/generated'
import { Features } from '@/utils/Features'
import { WarningPrompt } from './WarningPrompt/WarningPrompt'

type Props = {
  priceIntentWarning: PriceIntentWarning
  goBackToPreviousSection: () => void
}

export const Warning = ({ priceIntentWarning, goBackToPreviousSection }: Props) => {
  const [open, setOpen] = useState(true)

  const handleClickConfirm = () => {
    setOpen(false)
  }

  const handleEditPriceIntent = () => {
    setOpen(false)
    goBackToPreviousSection()
  }

  if (!Features.enabled('PRICE_INTENT_WARNING')) return null

  return (
    <DialogRoot open={open}>
      <DialogContent centerContent={true} onClose={handleClickConfirm}>
        <DialogWindow>
          <WarningPrompt
            {...priceIntentWarning}
            onClickConfirm={handleClickConfirm}
            onClickEdit={handleEditPriceIntent}
          />
        </DialogWindow>
      </DialogContent>
    </DialogRoot>
  )
}

const DialogRoot = styled(Dialog.Root)({
  zIndex: 1,
})

const DialogContent = styled(Dialog.Content)({
  position: 'fixed',
  top: '44vh',
  transform: 'translateY(-50%)',
  width: '100%',
})

const DialogWindow = styled(Dialog.Window)({
  width: '100%',
  maxWidth: '23rem',
  marginInline: 'auto',
  borderRadius: theme.radius.md,
})
