import styled from '@emotion/styled'

import {
  Button,
  CardContent,
  CardTitle,
  Copyable,
  Dropdown,
  DropdownOption,
  InfoRow,
  InfoText,
  Label,
  Loadable,
  Spacing,
  useConfirmDialog,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import { useRestrictClaim } from '@hope/common/hooks/use-restrict-claim'
import { ClaimDatePicker } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimDatePicker'
import { ClaimEmployeeDropdown } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimEmployeeDropdown'
import { ClaimStatusDropdown } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimStatusDropdown'
import { CoInsuredForm } from '@hope/features/claims/claim-details/CoInsured/CoInsuredForm'
import { useState } from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { useClaimCoInsured } from '../../hooks/useClaimCoInsured'
import { ClaimAudio } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimAudio'
import { ClaimLocationDropdown } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimLocationDropdown'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Tags } from '@hope/features/tags/Tags'
import { AssignClaimToAdmin } from './components/AssignClaimToAdmin'
import { ClaimContractDropdown } from './components/ClaimContractDropdown'

gql`
  query ClaimInformation($claimId: ID!) {
    claim(id: $claimId) {
      id
      claimNumber
      recordingUrl
      registrationDate
      market
    }
  }
`

const SelectWrapper = styled.div`
  margin-top: 1em;
`

export const ClaimInformation = () => {
  const { confirm } = useConfirmDialog()
  const {
    claimId,
    assignedAdmin,
    tags,
    claimOpenedAt,
    recordingUrl,
    claimNumber,
    restriction,
    coInsured,
    loading,
    error,
  } = useClaim()
  const { restrict } = useRestrictClaim(claimId)
  const [creatingCoInsured, setCreatingCoInsured] = useState(false)
  const { removeCoInsured } = useClaimCoInsured(claimId)

  const coInsureHandler = async (value: string) => {
    setCreatingCoInsured(value === 'True')
    if (!!coInsured && value === 'False') {
      confirm('This will delete the co-insured, are you sure?').then(() =>
        removeCoInsured(),
      )
    }
  }

  const coInsuredClaimOptions = [
    {
      key: 0,
      value: 'True',
      text: 'True',
      selected: Boolean(creatingCoInsured || coInsured),
    },
    {
      key: 1,
      value: 'False',
      text: 'False',
      selected: Boolean(!creatingCoInsured && !coInsured),
    },
  ]

  return (
    <CardContent>
      <Loadable loading={loading}>
        <CardTitle
          title="Claim Info"
          badge={
            error
              ? {
                  icon: BugFill,
                  status: 'danger',
                  label: 'Internal Error',
                }
              : null
          }
        />
        <Spacing top="tiny" />
        <Tags resourceId={claimId} tags={tags} />
        <Spacing top="small" />
        <InfoRow>
          Claim number
          <Copyable iconValue={claimNumber} />
        </InfoRow>
        <Spacing top="small" />
        <InfoRow>
          Opened at
          <InfoText>
            {claimOpenedAt &&
              format(parseISO(claimOpenedAt), 'yyyy-MM-dd HH:mm:ss')}
          </InfoText>
        </InfoRow>
        <Spacing top="small" />
        {recordingUrl && <ClaimAudio recordingUrl={recordingUrl} />}

        <SelectWrapper>
          <Label>Status</Label>
          <ClaimStatusDropdown />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Date of Occurrence</Label>
          <ClaimDatePicker />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Location</Label>
          <ClaimLocationDropdown />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Contract</Label>
          <ClaimContractDropdown claimId={claimId} />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <ClaimEmployeeDropdown />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Co-insured Claim</Label>
          <Dropdown>
            {coInsuredClaimOptions.map((opt) => (
              <DropdownOption
                key={opt.key}
                selected={opt.selected}
                onClick={() => coInsureHandler(opt.value)}
              >
                {opt.text}
              </DropdownOption>
            ))}
          </Dropdown>
          {(creatingCoInsured || !!coInsured) && (
            <>
              <div style={{ marginTop: '0.5em' }} />
              <CoInsuredForm coInsured={coInsured} />
            </>
          )}
        </SelectWrapper>
        {!restriction && (
          <SelectWrapper>
            <Button
              variant="tertiary"
              style={{
                width: '100%',
              }}
              onClick={() =>
                confirm('Are you sure you want to restrict access?').then(() =>
                  restrict(),
                )
              }
            >
              Restrict claim access
            </Button>
          </SelectWrapper>
        )}

        <AssignClaimToAdmin>
          <Button style={{ width: '100%' }} variant="tertiary">
            {assignedAdmin ? 'Manage claim admin' : 'Assign claim to admin'}
          </Button>
        </AssignClaimToAdmin>
      </Loadable>
    </CardContent>
  )
}
