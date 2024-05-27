'use client'

import { Space } from 'ui'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from './DebugTextKeys'

export const DefaultDebugDialog = () => {
  return (
    <DebugDialog>
      <Space y={0.25}>
        <DebugShopSessionSection />
        <DebugTextKeys />
      </Space>
    </DebugDialog>
  )
}
