import { createJSONStorage } from 'jotai/utils'
import { atomWithToggleAndStorage } from '@/utils/atomWithToggleAndStorage'

const storage = createJSONStorage(() => sessionStorage)
export const myMoneyConsentConfirmationFlagAtom = atomWithToggleAndStorage(
  'wasMyMoneyConsentShown',
  false,
  storage,
)
