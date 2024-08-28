import { format } from 'date-fns'
import {
  formatDistanceWithAccuracy,
  formatSsn,
  formatPostalCode,
  Placeholder,
} from '@hedvig-ui'
import { Tooltip } from '@hedvig-ui/redesign'
import { ClickToCopy, LabeledText } from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

export const ClaimMemberDetails = () => {
  const { memberId, member, agreement: claimAgreement, contract } = useClaim()
  const memberSignDate = member.signedOn ? new Date(member.signedOn) : undefined

  const agreement = claimAgreement ?? contract?.currentAgreement
  const address = agreement?.address
  return (
    <>
      <LabeledText label="Member ID">
        {memberId} <ClickToCopy value={memberId} />
      </LabeledText>
      <LabeledText label="Signed">
        <MemberSignDate signDate={memberSignDate} />
      </LabeledText>
      <LabeledText label="SSN">
        <MemberPersonalNumber personalNumber={member.personalNumber} />
      </LabeledText>
      <LabeledText label="Failed payments">
        <MemberFailedCharges
          numberFailedCharges={member.numberFailedCharges?.numberFailedCharges}
        />
      </LabeledText>
      <LabeledText label="Street">
        <MemberStreet street={address?.street} />
      </LabeledText>
      <LabeledText label="Mail">
        <MemberEmail email={member.email} />
      </LabeledText>
      <LabeledText label="City">
        <MemberCity city={address?.city} />
      </LabeledText>
      <LabeledText label="Phone">
        <MemberPhoneNumber phoneNumber={member.phoneNumber} />
      </LabeledText>
      <LabeledText label="Postal code">
        <MemberPostalCode postalCode={address?.postalCode} />
      </LabeledText>
    </>
  )
}

const MemberSignDate = ({ signDate }: { signDate: Date | undefined }) => {
  if (!signDate) {
    return <Placeholder>Not applicable</Placeholder>
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span>{format(signDate, 'yyyy-MM-dd')}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>{formatDistanceWithAccuracy(signDate)}</Tooltip.Content>
    </Tooltip.Root>
  )
}

const MemberPersonalNumber = ({
  personalNumber,
}: {
  personalNumber: string | undefined | null
}) => {
  if (!personalNumber) {
    return <Placeholder>Not applicable</Placeholder>
  }

  return (
    <>
      {formatSsn(personalNumber)}
      <ClickToCopy value={personalNumber} />
    </>
  )
}

const MemberFailedCharges = ({
  numberFailedCharges,
}: {
  numberFailedCharges: number | undefined
}) => {
  if (!numberFailedCharges) {
    return <Placeholder>None</Placeholder>
  }
  return numberFailedCharges
}

const MemberStreet = ({ street }: { street: string | undefined }) => {
  if (!street) {
    return <Placeholder>Not applicable</Placeholder>
  }
  return street
}

const MemberEmail = ({ email }: { email: string | undefined | null }) => {
  if (!email) {
    return <Placeholder>Not applicable</Placeholder>
  }
  return (
    <>
      {email} <ClickToCopy value={email} />
    </>
  )
}

const MemberCity = ({ city }: { city: string | undefined | null }) => {
  if (!city) {
    return <Placeholder>Not applicable</Placeholder>
  }
  return city
}

const MemberPhoneNumber = ({
  phoneNumber,
}: {
  phoneNumber: string | undefined | null
}) => {
  if (!phoneNumber) {
    return <Placeholder>Not applicable</Placeholder>
  }
  return phoneNumber
}

const MemberPostalCode = ({
  postalCode,
}: {
  postalCode: string | undefined
}) => {
  if (!postalCode) {
    return <Placeholder>Not applicable</Placeholder>
  }
  return formatPostalCode(postalCode)
}
