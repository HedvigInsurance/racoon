import type { ReactNode } from 'react'
import { Alert, CampaignIcon } from 'ui'

type Props = {
  children: ReactNode
}

export function BundleDiscountSummary({ children }: Props) {
  return (
    <Alert.Root variant="success">
      <Alert.Icon icon={CampaignIcon} />
      <Alert.Body>
        <Alert.Message color="textSecondaryOnGray" size="sm">
          {children}
        </Alert.Message>
      </Alert.Body>
    </Alert.Root>
  )
}
