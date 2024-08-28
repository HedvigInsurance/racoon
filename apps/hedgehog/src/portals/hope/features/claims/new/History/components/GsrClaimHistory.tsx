import { Collapsible, extractErrorMessage } from '@hedvig-ui'
import {
  Button,
  Card,
  Div,
  Flex,
  LabeledText,
  LegacyTooltip,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatus,
  TableRowStatusWithPopover,
} from '@hedvig-ui/redesign'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import {
  GsrClaim,
  SubclaimAgreementData,
  useSyncGsrClaimMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import GSRClaimCodes from '../../../claim-details/MemberInformation/components/GSRClaimCodes.json'
import GSRInsuranceCompanies from '../../../claim-details/MemberInformation/components/GSRInsuranceCompanies.json'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useState } from 'react'
import { ChevronDownIcon, IconButton } from '@hedvig-ui/icons'
import * as dateFns from 'date-fns'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const GsrClaimHistory = () => {
  const { member, claimNumber } = useClaim()
  const claims = member?.gsrClaims ?? []
  const currentClaim = claims.find((claim) => claim.claimNumber === claimNumber)

  if (member?.contractMarketInfo?.market !== 'SWEDEN') {
    // GSR is only available for Swedish members
    return null
  }

  return (
    <Card className={cssUtil.tableCard}>
      <div className={cssUtil.tableCardTitle}>
        <span>GSR ({claims.length ?? 0})</span>
        <SyncGSR />
      </div>

      {!!claims.length && (
        <Table>
          <TableHeader>
            <TableColumn>Claim number</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Company</TableColumn>
            <TableColumn />
          </TableHeader>
          {claims.map((claim) => {
            return (
              <MemberGSRClaimsTableRow
                key={claim.id}
                claim={claim}
                currentClaim={currentClaim}
              />
            )
          })}
        </Table>
      )}
    </Card>
  )
}

const SyncGSR = () => {
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
    <Flex gap="md" align="center" style={{ width: 'max-content' }}>
      <span className={cssUtil.textMuted}>
        Last sync:{' '}
        {lastSync
          ? `${formatDate(
              parseISO(lastSync),
              'dd MMMM, yyyy',
            )} at ${formatDate(parseISO(lastSync), 'HH:mm')}`
          : 'Not performed yet'}
      </span>
      <Button size="small" onClick={handleSyncGsr} disabled={loading}>
        Sync GSR
      </Button>
    </Flex>
  )
}

const MemberGSRClaimsTableRow = ({
  claim,
  currentClaim,
}: {
  claim: GsrClaim
  currentClaim?: GsrClaim
}) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false)

  const handleRowClick = () => {
    setShowExtraInfo((prev) => !prev)
  }

  return (
    <>
      <TableRow
        key={claim.id}
        onClick={handleRowClick}
        className={cssUtil.pointer}
      >
        <GsrTableRowStatus claim={claim} currentClaim={currentClaim} />
        <TableColumn>{claim.claimNumber}</TableColumn>
        <TableColumn>
          {formatDate(parseISO(claim.dateOfOccurrence), 'dd MMMM, yyyy')}
        </TableColumn>
        <TableColumn>
          {getInsuranceCompany(claim.insuranceCompanyId)}
        </TableColumn>
        <TableColumn>
          <Flex justify="flex-end">
            <LegacyTooltip content="Expand">
              <IconButton>
                <ChevronDownIcon
                  className={
                    showExtraInfo ? cssUtil.rotated180 : cssUtil.rotatable
                  }
                />
              </IconButton>
            </LegacyTooltip>
          </Flex>
        </TableColumn>
      </TableRow>

      <Collapsible collapsed={!showExtraInfo}>
        <Div px="medium" py="small">
          {claim.claimCodes.map((claimCode) => (
            <LabeledText key={claimCode} label={claimCode}>
              {getCodeDescription(claimCode)}
            </LabeledText>
          ))}
          {claim.registrationNumber && (
            <LabeledText label="Registration number">
              {claim.registrationNumber}
            </LabeledText>
          )}
        </Div>
      </Collapsible>
    </>
  )
}

const GsrTableRowStatus = ({
  claim,
  currentClaim,
}: {
  claim: GsrClaim
  currentClaim?: GsrClaim
}) => {
  const { dateOfOccurrence: internalClaimDateOfOccurence } = useClaim()
  const isCurrentClaim = claim.claimNumber === currentClaim?.claimNumber
  const claimCodesOverlap = currentClaim?.claimCodes.some((code) =>
    claim.claimCodes.includes(code),
  )
  const currentClaimDate = new Date(
    currentClaim?.dateOfOccurrence ?? internalClaimDateOfOccurence,
  )
  const daysSinceClaim = dateFns.differenceInDays(
    currentClaimDate,
    new Date(claim.dateOfOccurrence),
  )

  if (!currentClaim && isNaN(daysSinceClaim)) {
    return <TableRowStatus status="neutral" />
  }

  if (isCurrentClaim) {
    return (
      <TableRowStatusWithPopover status="info" popoverContent="This claim" />
    )
  }

  if (claimCodesOverlap) {
    return (
      <TableRowStatusWithPopover
        status="danger"
        popoverContent="Same claim code as this claim"
      />
    )
  }
  const daysSinceStatus = getDaysSinceStatus(daysSinceClaim)
  return (
    <TableRowStatusWithPopover
      status={daysSinceStatus.status}
      popoverContent={daysSinceStatus.description}
    />
  )
}

type ClaimCode = {
  codeID: string
  codeDescription: string
}

function getCodeDescription(codeId: string): string {
  const codes = GSRClaimCodes as ReadonlyArray<ClaimCode>
  const claimCode = Array.from(codes).find(
    (claimCode) => claimCode.codeID === codeId,
  )
  if (!claimCode) return 'Missing code description'
  return claimCode.codeDescription
}

type InsuranceCompany = {
  companyId: string
  name: string
}

function getInsuranceCompany(companyId: string | null | undefined): string {
  if (!companyId) return 'Unknown'
  const companies = GSRInsuranceCompanies as ReadonlyArray<InsuranceCompany>
  const insuranceCompany = Array.from(companies).find(
    (insuranceCompany) => insuranceCompany.companyId === companyId,
  )
  if (!insuranceCompany) return `${companyId} (Unknown company)`
  return insuranceCompany.name.replace(/[()]/g, '')
}

function getDaysSinceStatus(days: number) {
  if (days > 90) {
    return { status: 'success', description: 'More than 90 days ago' } as const
  }
  if (days > 30) {
    return { status: 'warning', description: 'More than 30 days ago' } as const
  }
  return { status: 'danger', description: 'Less than 30 days ago' } as const
}
