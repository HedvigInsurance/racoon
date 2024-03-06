import dynamic from 'next/dynamic'
import { Space } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'

export const BankIdDialogDynamic = dynamic({
  loader: async () => {
    const { BankIdDialog } = await import('./BankIdDialog')
    return BankIdDialog
  },
  loading: () => (
    <FullscreenDialog.Root open={true}>
      <FullscreenDialog.Modal center={true}>
        <Space y={0.5}>
          <Skeleton style={{ height: 22, width: 180 }} />
          <Skeleton style={{ height: 22, width: 200 }} />
        </Space>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  ),
})
