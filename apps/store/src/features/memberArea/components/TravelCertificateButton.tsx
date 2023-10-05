import Link from 'next/link'
import { useCallback } from 'react'
import { Button } from 'ui'
import {
  useMemberAreaMemberInfoQuery,
  useTravelCertificateCreateMutation,
} from '@/services/apollo/generated'
import { formatAPIDate } from '@/utils/date'

export const TravelCertificateButton = ({ contractId }: { contractId: string }) => {
  // Using same query as expected parent components instead of prop-drilling currentMember.email
  // Not sure it's production-quality solution
  const { data } = useMemberAreaMemberInfoQuery()
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
          email: data!.currentMember.email,
          isMemberIncluded: true,
          startDate: formatAPIDate(new Date()),
          coInsured: [],
        },
      },
    })
  }, [contractId, data, sendRequest])

  if (data == null) {
    console.warn('Expected to have MemberAreaMemberInfoQuery.data')
    return null
  }

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
