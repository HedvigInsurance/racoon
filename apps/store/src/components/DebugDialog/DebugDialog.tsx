'use client'

import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type ReactNode, useEffect, useState } from 'react'
import { Dialog, mq, theme } from 'ui'

export const DebugDialog = (props: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrl = event.getModifierState('Control')
      if (ctrl && event.key === 'd') {
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
  padding: theme.space.lg,
  paddingTop: theme.space.md,
  borderBottomRightRadius: theme.radius.sm,
  borderBottomLeftRadius: theme.radius.sm,
  maxWidth: `calc(100% - ${theme.space.xs} * 2)`,
  marginInline: 'auto',

  [mq.md]: {
    maxWidth: '40rem',
  },
})
