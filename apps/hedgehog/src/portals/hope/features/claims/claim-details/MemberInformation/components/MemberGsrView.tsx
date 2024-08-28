import styled from '@emotion/styled'
import {
  Button,
  convertEnumOrSentenceToTitle,
  extractErrorMessage,
  Flex,
  Label,
} from '@hedvig-ui'
import chroma from 'chroma-js'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import * as React from 'react'
import {
  SubclaimAgreementData,
  useSyncGsrClaimMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import GSRClaimCodes from './GSRClaimCodes.json'
import GSRInsuranceCompanies from './GSRInsuranceCompanies.json'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const SyncButton = styled(Button)`
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  padding-bottom: 0;
  padding-top: 0;
`

const GsrClaimWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  width: 100%;
  border-radius: 0.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.15).hex()};

  padding: 0.75rem;
`

interface ClaimCode {
  codeID: string
  codeDescription: string
}

const getCodeDescription = (codeId: string): string => {
  const codes = GSRClaimCodes as ReadonlyArray<ClaimCode>
  const claimCode = Array.from(codes).find(
    (claimCode) => claimCode.codeID === codeId,
  )
  if (!claimCode) return `${codeId} (Missing)`
  return `${codeId} - ${convertEnumOrSentenceToTitle(
    claimCode.codeDescription,
  )}`
}

interface InsuranceCompany {
  companyId: string
  name: string
}

const getInsuranceCompany = (companyId: string): string => {
  const companies = GSRInsuranceCompanies as ReadonlyArray<InsuranceCompany>
  const insuranceCompany = Array.from(companies).find(
    (insuranceCompany) => insuranceCompany.companyId === companyId,
  )
  if (!insuranceCompany) return `${companyId} (Missing)`
  return convertEnumOrSentenceToTitle(
    insuranceCompany.name.replace(/[()]/g, ''),
  )
}

export const MemberGsrView: React.FC<{
  slim?: boolean
}> = () => {
  const [syncGsrClaim, { loading }] = useSyncGsrClaimMutation()

  const { claimId, member, contract, agreement, subclaims } = useClaim()

  const gsrClaims = member?.gsrClaims ?? []

  const subclaimAgreementData =
    subclaims.reduce((acc, subclaim) => {
      if (contract && agreement) {
        acc.push({
          subclaimId: subclaim.id,
          insuranceType: contract.insuranceType,
          carrier: agreement.carrier,
          registrationNumber: agreement.registrationNumber ?? undefined,
        })
      }
      return acc
    }, [] as SubclaimAgreementData[]) ?? []

  const handleSyncGsr = () => {
    if (loading) {
      return
    }
    if (!member?.personalNumber) {
      return toast.error('Could not find ssn for member')
    }
    if (subclaimAgreementData.length === 0) {
      return toast.error('No contract/agreement set for claim')
    }

    toast.promise(
      syncGsrClaim({
        variables: {
          input: {
            claimId,
            ssn: member.personalNumber,
            subclaimAgreementData,
          },
        },
      }),
      {
        loading: 'Loading',
        success: 'Success',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const lastSync =
    gsrClaims.length > 0
      ? gsrClaims.reduce((acc, gsrClaim) => {
          return gsrClaim.updatedOn > acc ? gsrClaim.updatedOn : acc
        }, gsrClaims[0].updatedOn)
      : null

  return (
    <div>
      <Flex justify="space-between" align="flex-end">
        <Label>
          Last sync:{' '}
          {lastSync
            ? `${formatDate(
                parseISO(lastSync),
                'dd MMMM, yyyy',
              )} at ${formatDate(parseISO(lastSync), 'HH:mm:ss')}`
            : 'Not performed yet'}
        </Label>
        <SyncButton
          size="small"
          variant="tertiary"
          onClick={handleSyncGsr}
          disabled={loading}
        >
          Sync GSR
        </SyncButton>
      </Flex>
      <Flex direction="column" gap="small">
        {gsrClaims.map((gsrClaim) => (
          <GsrClaimWrapper key={gsrClaim.claimNumber}>
            <div>
              <Label>Claim ID</Label>
              <p>{gsrClaim.claimNumber}</p>
            </div>
            <div>
              <Label>Date of Occurrence</Label>
              <p>
                {formatDate(
                  parseISO(gsrClaim.dateOfOccurrence),
                  'dd MMMM, yyyy',
                )}
              </p>
            </div>
            {gsrClaim.insuranceCompanyId && (
              <div>
                <Label>Company</Label>
                <p>{getInsuranceCompany(gsrClaim.insuranceCompanyId)}</p>
              </div>
            )}
            {gsrClaim.claimCodes && gsrClaim.claimCodes.length > 0 && (
              <div>
                <Label>Claim Codes</Label>
                {gsrClaim.claimCodes.map((claimCode) => (
                  <p key={claimCode}>{getCodeDescription(claimCode)}</p>
                ))}
              </div>
            )}
            {gsrClaim.registrationNumber && (
              <div>
                <Label>Registration number</Label>
                <p>{gsrClaim.registrationNumber}</p>
              </div>
            )}
          </GsrClaimWrapper>
        ))}
      </Flex>
    </div>
  )
}
