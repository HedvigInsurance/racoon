import dynamic from 'next/dynamic'
import { Space } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Skeleton } from '@/components/Skeleton'
import { contentWrapper } from './BankIdV6Dialog.css'

export const BankIdV6DialogDynamic = dynamic({
  loader: async () => {
    const { BankIdV6Dialog } = await import('./BankIdV6Dialog')
    return BankIdV6Dialog
  },
  loading: () => (
    <FullscreenDialog.Root open={true}>
      <FullscreenDialog.Modal center={true}>
        <Space className={contentWrapper} y={2}>
          <Skeleton style={{ height: 64, width: 64 }} />

          <Skeleton style={{ height: 200, width: 200 }} />

          <Space y={0.5}>
            <Skeleton style={{ height: 22, width: 384 }} />
            <Skeleton style={{ height: 68, width: 384 }} />
          </Space>
        </Space>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  ),
  ssr: false,
})
