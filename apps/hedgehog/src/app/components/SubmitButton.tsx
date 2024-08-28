import { Button } from '@hedvig-ui/redesign'
import { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

export function SubmitButton({
  children,
  disabled,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()

  const isDisabled = disabled || pending

  return (
    <Button type="submit" loading={pending} disabled={isDisabled} {...props}>
      {children}
    </Button>
  )
}
