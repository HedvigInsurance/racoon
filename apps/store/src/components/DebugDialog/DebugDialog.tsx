'use client'

import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type ReactNode, useEffect, useState } from 'react'
import { Dialog, mq, theme } from 'ui'

const CTRL_SHIFT_D = '∆'

export const DebugDialog = (props: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === 'd') || event.key === CTRL_SHIFT_D) {
        datadogRum.addAction('open debug-dialog')
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <DialogContent onClose={() => setOpen(false)}>
        <Dialog.Title style={{ display: 'none' }}>Debug tools</Dialog.Title>
        <DialogWindow>{props.children}</DialogWindow>
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  maxWidth: '100%',
  display: 'flex',
  alignItems: 'center',
})

const DialogWindow = styled(Dialog.Window)({
  padding: theme.space.md,
  borderBottomRightRadius: theme.radius.sm,
  borderBottomLeftRadius: theme.radius.sm,
  maxWidth: `calc(100% - ${theme.space.xs} * 2)`,
  marginInline: 'auto',

  [mq.md]: {
    maxWidth: '40rem',
  },
})
