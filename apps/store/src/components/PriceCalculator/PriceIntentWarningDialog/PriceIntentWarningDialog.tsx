import { useAtom, useSetAtom } from 'jotai'
import { Dialog } from 'ui'
import {
  activeFormSectionIdAtom,
  GOTO_NEXT_SECTION,
  usePriceIntent,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { dialogContent, dialogWindow } from './PriceIntentWarningDialog.css'
import { showPriceIntentWarningAtom } from './showPriceIntentWarningAtom'
import { WarningPrompt } from './WarningPrompt'

export function PriceIntentWarningDialog() {
  const priceIntentWarning = usePriceIntent().warning
  const [isOpen, setIsOpen] = useAtom(showPriceIntentWarningAtom)

  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const goToNextSection = () => {
    setActiveSectionId(GOTO_NEXT_SECTION)
  }

  const handleClickConfirm = () => {
    setIsOpen(false)
    goToNextSection()
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
