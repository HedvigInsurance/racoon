import { Flex } from '@hedvig-ui/redesign'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<typeof Flex> {
  label: string
  value?: ReactNode | null
}

export function ClaimItemDataPoint({ label, value, ...props }: Props) {
  if (!value) {
    return null
  }

  return (
    <Flex justify="space-between" gap="sm" {...props}>
      <p>{label}</p>
      <span style={{ textAlign: 'right' }}>{value}</span>
    </Flex>
  )
}
