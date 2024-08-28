import { useClaim } from '../../hooks/use-claim'
import { Flex } from '@hedvig-ui/redesign'
import { MemberFossView } from '../../claim-details/MemberInformation/components/MemberFossView'
import { GsrClaimHistory } from './components/GsrClaimHistory'
import { InternalClaimHistory } from './components/InternalClaimHistory'
import { FirstVetHistory } from './components/FirstVetHistory'

type Props = {
  onClickClaim: (claimId: string) => void
}

export const ClaimHistory = (props: Props) => {
  const { member } = useClaim()

  return (
    <Flex direction="column" gap="medium">
      <InternalClaimHistory onClickClaim={props.onClickClaim} />

      <GsrClaimHistory />

      <FirstVetHistory />

      {/* FOSS is only available for Norwegian members */}
      {member?.contractMarketInfo?.market === 'NORWAY' && <MemberFossView />}
    </Flex>
  )
}
