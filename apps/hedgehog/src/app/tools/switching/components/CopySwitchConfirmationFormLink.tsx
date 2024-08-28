'use client'

import toast from 'react-hot-toast'
import { PropsWithSwitcherCase } from '../page'
import { Button } from '@hedvig-ui/redesign'

export function CopySwitchConfirmationFormLink({
  switcher,
}: PropsWithSwitcherCase) {
  const baseURL = process.env.NEXT_PUBLIC_HEDVIG_COM
  const URL = `${baseURL}/switcher/${switcher.id}`

  const writeLinkToClipboard = () => {
    navigator.clipboard.writeText(URL)
    toast('Copied!')
  }
  return (
    <Button onClick={writeLinkToClipboard} variant="secondary">
      Copy switch confirmation form link
    </Button>
  )
}
