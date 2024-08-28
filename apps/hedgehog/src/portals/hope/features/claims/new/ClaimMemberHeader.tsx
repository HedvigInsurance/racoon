import {
  ClickToCopy,
  Grid,
  LabeledText,
  OrbIndicator,
} from '@hedvig-ui/redesign'
import { convertEnumToSentence } from '@hedvig-ui'
import { useClaim } from '../hooks/use-claim'
import { Flag } from 'types/generated/graphql'
import { Link } from 'react-router-dom'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

const getFraudStatus = (status: string) => {
  if (status === 'REGULAR_INVESTIGATION') {
    return 'success'
  }
  if (status === 'EXTENDED_INVESTIGATION') {
    return 'warning'
  }
  if (status === 'CONFIRMED_FRAUD') {
    return 'danger'
  }
  return 'neutral'
}

const SANCTION_STATUS = {
  FullHit: 'danger',
  NoHit: 'success',
  PartialHit: 'warning',
  Undetermined: 'neutral',
} as const

const DEBT_FLAG_DESCRIPTION: Record<Flag, string> = {
  [Flag.Green]: 'No Debt',
  [Flag.Amber]: 'Minor Debt',
  [Flag.Red]: 'Major Debt',
}

const DEBT_FLAG_STATUS = {
  [Flag.Green]: 'success',
  [Flag.Amber]: 'warning',
  [Flag.Red]: 'danger',
} as const

export const ClaimMemberHeader = ({
  isInboxView,
}: {
  isInboxView: boolean
}) => {
  const { member } = useClaim()
  const {
    taskNavigate,
    params: { tab: taskTab, taskId, claimIds },
  } = useTaskNavigation()

  const memberName = `${member?.firstName} ${member?.lastName}`
  return (
    <Grid equalColumns={6}>
      <LabeledText label="Member">{memberName}</LabeledText>
      <LabeledText label="Member ID">
        {isInboxView ? (
          <span
            className={cssUtil.pointer}
            onClick={() =>
              taskNavigate({
                memberId: member.memberId,
                tab: taskTab,
                active: member.memberId,
                claimIds,
                taskId,
              })
            }
          >
            {member.memberId}
          </span>
        ) : (
          <Link to={`/members/${member.memberId}`} title="Open members page">
            {member.memberId}
          </Link>
        )}
        <ClickToCopy value={member.memberId} />
      </LabeledText>
      <LabeledText label="Status">
        {member.fraudulentStatus ? (
          <>
            <OrbIndicator status={getFraudStatus(member.fraudulentStatus)} />
            {convertEnumToSentence(member.fraudulentStatus)}
          </>
        ) : (
          'Not Applicable'
        )}
      </LabeledText>
      <LabeledText label="Direct debit">
        <OrbIndicator
          status={member.payoutMethodStatus?.activated ? 'success' : 'danger'}
        />
        {member.payoutMethodStatus?.activated ? 'Activated' : 'Not activated'}
      </LabeledText>
      <LabeledText label="Sanction status">
        {member.sanctionStatus ? (
          <>
            <OrbIndicator status={SANCTION_STATUS[member.sanctionStatus]} />
            {convertEnumToSentence(member.sanctionStatus)}
          </>
        ) : (
          'Not Applicable'
        )}
      </LabeledText>
      <LabeledText label="Debt status">
        {member?.person?.debtFlag ? (
          <>
            <OrbIndicator status={DEBT_FLAG_STATUS[member.person.debtFlag]} />
            {DEBT_FLAG_DESCRIPTION[member.person.debtFlag]}
          </>
        ) : (
          'Not applicable'
        )}
      </LabeledText>
    </Grid>
  )
}
