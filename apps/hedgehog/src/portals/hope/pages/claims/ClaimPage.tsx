import * as React from 'react'
import { useParams } from 'react-router-dom'
import { StandaloneMessage } from '@hedvig-ui'
import { ClaimPageContent } from '@hope/features/claims/ClaimPageContent'

const ClaimPage: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>()

  if (!claimId) {
    return <StandaloneMessage>Claim not found</StandaloneMessage>
  }
  return <ClaimPageContent claimId={claimId} isInboxView={false} />
}

export default ClaimPage
