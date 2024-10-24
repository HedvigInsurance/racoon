import Link from 'next/link'
import { useCallback } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { useMemberAreaInfo } from '@/features/memberArea/useMemberAreaInfo'
import { useTravelCertificateCreateMutation } from '@/services/graphql/generated'
import { formatAPIDate } from '@/utils/date'

// Temporary demo implementation, should be replaced by flow with certificate params form before sending the request
export const TravelCertificateButton = ({ contractId }: { contractId: string }) => {
  const currentMember = useMemberAreaInfo()
  const [sendRequest, result] = useTravelCertificateCreateMutation()

  const handleRequestCertificate = useCallback(() => {
    alert(
      `Demo version!
      
      In real life there should be dialog asking you for certificate parameters. We will use defaults for now`,
    )
    sendRequest({
      variables: {
        input: {
          contractId,
          email: currentMember.email,
          isMemberIncluded: true,
          startDate: formatAPIDate(new Date()),
          coInsured: [],
        },
      },
    })
  }, [contractId, currentMember, sendRequest])

  if (result.data != null) {
    return (
      <Link href={result.data.travelCertificateCreate.signedUrl} download={true}>
        📄Certificate is ready! Click to download
      </Link>
    )
  }

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={handleRequestCertificate}
      loading={result.loading}
    >
      Travel certificate
    </Button>
  )
}
