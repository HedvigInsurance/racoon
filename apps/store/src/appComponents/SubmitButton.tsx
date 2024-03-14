'use client'

import { ComponentPropsWithoutRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from 'ui'

export function SubmitButton({ children, ...props }: ComponentPropsWithoutRef<'button'>) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" loading={pending} disabled={pending} {...props}>
      {children}
    </Button>
  )
}
