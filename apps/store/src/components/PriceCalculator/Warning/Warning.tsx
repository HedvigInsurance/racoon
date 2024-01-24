import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { Dialog, theme } from 'ui'
import { PriceIntentWarning } from '@/services/graphql/generated'
import { Features } from '@/utils/Features'
import { showPriceIntentWarningAtom } from './showPriceIntentWarningAtom'
import { WarningPrompt } from './WarningPrompt/WarningPrompt'

type Props = {
  priceIntentWarning: PriceIntentWarning
  goBackToPreviousSection: () => void
}

export const Warning = ({ priceIntentWarning, goBackToPreviousSection }: Props) => {
  const [isOpen, setIsOpen] = useAtom(showPriceIntentWarningAtom)

  const handleClickConfirm = () => {
    setIsOpen(false)
  }

  const handleEditPriceIntent = () => {
    setIsOpen(false)
    goBackToPreviousSection()
  }

  if (!Features.enabled('PRICE_INTENT_WARNING')) return null

  return (
    <DialogRoot open={isOpen}>
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
