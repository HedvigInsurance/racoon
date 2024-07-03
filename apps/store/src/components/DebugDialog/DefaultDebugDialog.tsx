'use client'

import { yStack } from 'ui'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from './DebugTextKeys'

export const DefaultDebugDialog = () => {
  return (
    <DebugDialog>
      <div className={yStack({ gap: 'xs' })}>
        <DebugShopSessionSection />
        <DebugTextKeys />
      </div>
    </DebugDialog>
  )
}
