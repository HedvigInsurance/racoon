import dynamic from 'next/dynamic'
import { Space } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { wait } from '@/utils/wait'
import { shouldOpenDialog } from './BankIdV6Dialog'
import { contentWrapper } from './BankIdV6Dialog.css'

export function BankIdV6DialogDynamic() {
  const { currentOperation } = useBankIdContext()
  const openDialog = shouldOpenDialog(currentOperation)

  if (!openDialog) return null

  return <LazyLoadedDialog />
}

const LazyLoadedDialog = dynamic({
  loader: async () => {
    const { BankIdV6Dialog } = await import('./BankIdV6Dialog')
    // To avoid some flashing UI we wait a bit before showing the dialog
    // It seems something around 1s is recommended for such cases.
    // https://shorturl.at/nqrS4
    await wait(800)
    return BankIdV6Dialog
  },
  loading: () => (
    <FullscreenDialog.Root open={true}>
      {/* We use Header={null} here to remove close button from header as it */}
      {/* doesn't make sense to have for a 'loading' dialog */}
      <FullscreenDialog.Modal center={true} Header={null}>
        <Space className={contentWrapper} y={0.5}>
          <Skeleton style={{ height: 22, width: 180 }} />
          <Skeleton style={{ height: 22, width: 200 }} />
        </Space>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  ),
  ssr: false,
})
