import { Button } from '@hedvig-ui/redesign'
import { PropsWithSwitcherCase } from '../page'

export function DownloadMandate({ switcher }: PropsWithSwitcherCase) {
  return (
    <Button href={switcher.mandatePdfUrl!} target="_blank" variant="secondary">
      Download mandate
    </Button>
  )
}
