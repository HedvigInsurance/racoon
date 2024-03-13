import { useFormStatus } from 'react-dom'
import { Button } from 'ui'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" loading={pending} disabled={pending}>
      Create session
    </Button>
  )
}
