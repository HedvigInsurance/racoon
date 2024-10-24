'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from 'ui/src/components/Button/Button'

export function SubmitButton({ children, ...props }: ComponentPropsWithoutRef<'button'>) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" loading={pending} disabled={pending} fullWidth={true} {...props}>
      {children}
    </Button>
  )
}
