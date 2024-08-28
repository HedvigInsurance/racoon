import { useState } from 'react'
import {
  Collapsible,
  Loadable,
  formatDistanceWithAccuracy,
  useConfirmDialog,
} from '@hedvig-ui'
import {
  Grid,
  Dropdown,
  Button,
  LabeledText,
  ClickToCopy,
  Flex,
  Tooltip,
} from '@hedvig-ui/redesign'
import { formatDate } from 'date-fns/format'
import gql from 'graphql-tag'
import { useRestrictClaim } from '@hope/common/hooks/use-restrict-claim'
import { CoInsuredForm } from '@hope/features/claims/claim-details/CoInsured/CoInsuredForm'
import { ClaimAudio } from '@hope/features/claims/claim-details/ClaimInformation/components/ClaimAudio'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useClaimCoInsured } from '../../../hooks/useClaimCoInsured'
import { AssignClaimToAdmin } from '../../../claim-details/ClaimInformation/components/AssignClaimToAdmin'
import { TagsNew } from '../../Tags/TagsNew'
import { sumOfAmounts } from '../../helpers'
import { PaymentOrderState } from '../../../../config/constants'
import { section, sectionHeader, sectionTitle } from '../section.css'
import {
  ClaimDatePickerNew,
  ClaimEmployeeDropdownNew,
  ClaimInformationNotes,
  ClaimLocationDropdownNew,
  ClaimStatusDropdownNew,
  ClaimTranscriptionsNew,
} from './components'
import { ExpandToggler } from '../ExpandToggler'
import clsx from 'clsx'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

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
    memberFreeText,
    claimTranscriptions,
    subclaims,
  } = useClaim()
  const { restrict } = useRestrictClaim(claimId)
  const [creatingCoInsured, setCreatingCoInsured] = useState(false)
  const { removeCoInsured } = useClaimCoInsured(claimId)
  const [showClaimInformation, setShowClaimInformation] = useState(false)
  const toggleShowClaimInformation = () =>
    setShowClaimInformation((prev) => !prev)

  const coInsureHandler = async (value: string) => {
    setCreatingCoInsured(value === 'True')
    if (!!coInsured && value === 'False') {
      confirm('This will delete the co-insured, are you sure?').then(() =>
        removeCoInsured(),
      )
    }
  }

  const claimReserves = subclaims.flatMap(({ reserves }) => reserves)
  const totalReserves = sumOfAmounts(claimReserves)
  const claimPayouts = subclaims
    .flatMap(({ paymentOrders }) => paymentOrders)
    .filter(({ state }) => state === PaymentOrderState.Settled)
  const totalPayouts = sumOfAmounts(claimPayouts)

  return (
    <Loadable loading={loading}>
      <Flex direction="column" gap="medium" align="stretch">
        <section className={section}>
          <div
            className={clsx(sectionHeader, cssUtil.pointer)}
            onClick={toggleShowClaimInformation}
          >
            <p className={sectionTitle}>Claim information</p>
            <ExpandToggler active={showClaimInformation} />
          </div>

          <TagsNew resourceId={claimId} tags={tags} />

          <Collapsible collapsed={!showClaimInformation}>
            <Grid equalColumns={2} columnGap="small">
              <LabeledText label="Claim number">
                {claimNumber}
                <ClickToCopy value={claimNumber} />
              </LabeledText>

              <LabeledText label="Opened at">
                {claimOpenedAt ? (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span>
                        {formatDate(new Date(claimOpenedAt), 'yyyy-MM-dd')}
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      {formatDistanceWithAccuracy(new Date(claimOpenedAt))}
                    </Tooltip.Content>
                  </Tooltip.Root>
                ) : (
                  'Not opened'
                )}
              </LabeledText>

              <LabeledText label="Total reserves">{totalReserves}</LabeledText>

              <LabeledText label="Total payouts">{totalPayouts}</LabeledText>
            </Grid>
          </Collapsible>
        </section>

        <ClaimDatePickerNew />

        <Grid equalColumns={2} gap="medium">
          {!restriction && (
            <Button
              variant="secondary"
              onClick={() =>
                confirm('Are you sure you want to restrict access?').then(() =>
                  restrict(),
                )
              }
            >
              Restrict claim access
            </Button>
          )}

          <div style={{ gridColumn: '2' }}>
            <AssignClaimToAdmin>
              <Button variant="secondary" fullWidth>
                {assignedAdmin ? 'Manage claim admin' : 'Assign claim to admin'}
              </Button>
            </AssignClaimToAdmin>
          </div>
        </Grid>

        <Flex direction="column" gap="xxs">
          {recordingUrl && <ClaimAudio recordingUrl={recordingUrl} />}

          {!!memberFreeText && (
            <LabeledText label="Member answer">{memberFreeText}</LabeledText>
          )}

          {!!claimTranscriptions.length && <ClaimTranscriptionsNew />}
        </Flex>

        <ClaimInformationNotes />

        <Flex direction="column" gap="small">
          <ClaimStatusDropdownNew />

          <ClaimLocationDropdownNew />

          <Grid equalColumns={2} gap="small">
            <ClaimEmployeeDropdownNew />
            <Dropdown
              label="Co-insured claim"
              options={[
                {
                  value: 'True',
                  label: 'Yes',
                  selected: Boolean(creatingCoInsured || coInsured),
                  action: () => coInsureHandler('True'),
                },
                {
                  value: 'False',
                  label: 'No',
                  selected: Boolean(!creatingCoInsured && !coInsured),
                  action: () => coInsureHandler('False'),
                },
              ]}
            />
          </Grid>

          {(creatingCoInsured || !!coInsured) && (
            <CoInsuredForm coInsured={coInsured} />
          )}
        </Flex>
      </Flex>
    </Loadable>
  )
}
