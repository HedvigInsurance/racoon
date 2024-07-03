import { useAtom } from 'jotai'
import { Dialog } from 'ui'
import { usePriceIntent } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { dialogContent, dialogWindow } from './PriceIntentWarningDialog.css'
import { showPriceIntentWarningAtom } from './showPriceIntentWarningAtom'
import { WarningPrompt } from './WarningPrompt'

type Props = {
  onConfirm: () => void
}

export function PriceIntentWarningDialog({ onConfirm }: Props) {
  const priceIntentWarning = usePriceIntent().warning
  const [isOpen, setIsOpen] = useAtom(showPriceIntentWarningAtom)

  const handleClickConfirm = () => {
    setIsOpen(false)
    onConfirm()
  }

  const handleEditPriceIntent = () => {
    setIsOpen(false)
  }

  if (priceIntentWarning == null) return null

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Content
        className={dialogContent}
        centerContent={true}
        frostedOverlay={true}
        onClose={handleClickConfirm}
      >
        <Dialog.Window className={dialogWindow}>
          <WarningPrompt
            {...priceIntentWarning}
            onClickConfirm={handleClickConfirm}
            onClickEdit={handleEditPriceIntent}
          />
        </Dialog.Window>
      </Dialog.Content>
    </Dialog.Root>
  )
}
