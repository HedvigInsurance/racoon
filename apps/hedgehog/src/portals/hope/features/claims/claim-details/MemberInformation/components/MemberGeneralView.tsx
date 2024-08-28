import styled from '@emotion/styled'
import {
  convertCamelcaseToTitle,
  convertEnumOrSentenceToTitle,
  Copyable,
  Flex,
  formatDistanceWithAccuracy,
  formatMoney,
  formatPostalCode,
  formatSsn,
  InfoContainer,
  InfoSection,
  InfoTag,
  InfoTagStatus,
  Loadable,
  Placeholder,
  Popover,
} from '@hedvig-ui'
import { format, parse, parseISO } from 'date-fns'
import {
  getFirstMasterInception,
  getLastTerminationDate,
} from '@hope/features/contracts/utils'
import { Flag, SanctionStatus } from 'types/generated/graphql'
import gql from 'graphql-tag'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

type FraudulentStatus =
  | 'REGULAR_INVESTIGATION'
  | 'EXTENDED_INVESTIGATION'
  | 'CONFIRMED_FRAUD'

const fraudulentStatusMap: Record<FraudulentStatus, InfoTagStatus> = {
  REGULAR_INVESTIGATION: 'success',
  EXTENDED_INVESTIGATION: 'warning',
  CONFIRMED_FRAUD: 'danger',
}

const sanctionStatusMap: Record<SanctionStatus, InfoTagStatus> = {
  [SanctionStatus.NoHit]: 'success',
  [SanctionStatus.PartialHit]: 'warning',
  [SanctionStatus.Undetermined]: 'warning',
  [SanctionStatus.FullHit]: 'danger',
}

const debtFlagMap: Record<Flag, InfoTagStatus> = {
  [Flag.Green]: 'success',
  [Flag.Amber]: 'warning',
  [Flag.Red]: 'danger',
}

const debtFlagDescriptionMap: Record<Flag, string> = {
  [Flag.Green]: 'No Debt',
  [Flag.Amber]: 'Minor Debt',
  [Flag.Red]: 'Major Debt',
}

export const Info = styled.div`
  width: 100%;
  margin: 0.5rem 0;

  > span {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.semiStrongForeground};
    margin-bottom: -0.1rem;
  }

  > div {
    border-radius: 0.5rem;
  }
`

gql`
  query MemberGeneralView($claimId: ID!) {
    claim(id: $claimId) {
      id
      subclaims {
        id
      }
      member {
        memberId
        personalNumber
        firstName
        lastName
        signedOn
        contracts {
          id
          masterInception
          terminationDate
        }
        contractMarketInfo {
          market
          preferredCurrency
        }
        fraudulentStatus
        directDebitStatus {
          activated
        }
        sanctionStatus
        person {
          debtFlag
        }
        masterLedgerBreakdown {
          outstandingAmountBreakdown {
            amount
            currency
          }
        }
        numberFailedCharges {
          numberFailedCharges
        }
      }
    }
  }
`

export const MemberGeneralView = () => {
  const { member, loading, agreement: claimAgreement, contract } = useClaim()

  const agreement = claimAgreement ?? contract?.currentAgreement
  const address = agreement?.address
  const registrationNumber = agreement?.registrationNumber
  const firstMasterInception = getFirstMasterInception(member?.contracts ?? [])
  const lastTermination = getLastTerminationDate(member?.contracts ?? [])

  return (
    <InfoContainer>
      <Loadable loading={loading}>
        <InfoSection>
          <Flex direction="row">
            <Info style={{ width: '70%' }}>
              <span>Personal number</span>
              <div>
                {member?.personalNumber ? (
                  <Copyable
                    iconValue={formatSsn(member.personalNumber)}
                    iconLabel={'personal number'}
                  />
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </div>
            </Info>
          </Flex>
        </InfoSection>
        {registrationNumber && (
          <InfoSection>
            <Info>
              <span>Registration Number</span>
              <div>{registrationNumber}</div>
            </Info>
          </InfoSection>
        )}
        {address && (
          <InfoSection>
            <Flex direction="row">
              <Info style={{ width: '70%' }}>
                <span>Street</span>
                <div>{convertEnumOrSentenceToTitle(address.street)}</div>
              </Info>
              <Info style={{ width: '30%' }}>
                <span>Postal code</span>
                <div>{formatPostalCode(address.postalCode)}</div>
              </Info>
            </Flex>
            {address.city && (
              <Info>
                <span>City</span>
                <div>{convertEnumOrSentenceToTitle(address.city)}</div>
              </Info>
            )}
          </InfoSection>
        )}

        <InfoSection>
          <Flex direction="row">
            <Info style={{ marginRight: '0.5rem' }}>
              <span>Investigation need</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.fraudulentStatus
                      ? fraudulentStatusMap[
                          member.fraudulentStatus as FraudulentStatus
                        ]
                      : 'neutral'
                  }
                >
                  {member?.fraudulentStatus
                    ? convertEnumOrSentenceToTitle(member.fraudulentStatus)
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>

            <Info style={{ marginLeft: '0.5rem' }}>
              <span>Direct Debit</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.directDebitStatus?.activated ? 'success' : 'warning'
                  }
                >
                  {member?.directDebitStatus?.activated
                    ? 'Activated'
                    : 'Not Activated'}
                </InfoTag>
              </div>
            </Info>
          </Flex>

          <Flex direction="row" justify="center" align="center">
            <Info style={{ marginRight: '0.5rem' }}>
              <span>Sanction Status</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.sanctionStatus
                      ? sanctionStatusMap[member.sanctionStatus]
                      : 'neutral'
                  }
                >
                  {member?.sanctionStatus
                    ? convertCamelcaseToTitle(member.sanctionStatus)
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>

            <Info style={{ marginLeft: '0.5rem' }}>
              <span>Debt status</span>
              <div>
                <InfoTag
                  style={{
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                    textAlign: 'center',
                  }}
                  status={
                    member?.person?.debtFlag
                      ? debtFlagMap[member.person.debtFlag]
                      : 'neutral'
                  }
                >
                  {member?.person?.debtFlag
                    ? debtFlagDescriptionMap[member.person.debtFlag]
                    : 'Not applicable'}
                </InfoTag>
              </div>
            </Info>
          </Flex>
        </InfoSection>

        <InfoSection>
          <Info>
            <span>Signed</span>
            <div>
              {member?.signedOn ? (
                <Popover
                  contents={formatDistanceWithAccuracy(
                    parseISO(member.signedOn),
                  )}
                >
                  {member.signedOn &&
                    format(parseISO(member.signedOn), 'yyyy-MM-dd HH:mm')}
                </Popover>
              ) : (
                <Placeholder>Not applicable</Placeholder>
              )}
            </div>
          </Info>

          <Flex direction="row">
            <Info>
              <span>Master inception</span>
              <div>
                <Popover
                  contents={
                    firstMasterInception
                      ? formatDistanceWithAccuracy(
                          parse(firstMasterInception, 'yyyy-MM-dd', new Date()),
                        )
                      : 'Never active'
                  }
                >
                  {firstMasterInception ?? (
                    <Placeholder>Never active</Placeholder>
                  )}
                </Popover>
              </div>
            </Info>

            <Info>
              <span>Last termination date</span>
              <div>
                {lastTermination ?? <Placeholder>Not applicable</Placeholder>}
              </div>
            </Info>
          </Flex>

          <Flex direction="row">
            <Info>
              <span>Payments balance</span>
              <div>
                {member?.masterLedgerBreakdown?.outstandingAmountBreakdown ? (
                  formatMoney({
                    amount:
                      member.masterLedgerBreakdown.outstandingAmountBreakdown
                        .amount,
                    currency:
                      member.masterLedgerBreakdown.outstandingAmountBreakdown
                        .currency,
                  })
                ) : (
                  <Placeholder>Not applicable</Placeholder>
                )}
              </div>
            </Info>
            <Info>
              <span>Failed payments</span>
              <div>
                {member?.numberFailedCharges?.numberFailedCharges === 0 ? (
                  <Placeholder>None</Placeholder>
                ) : (
                  member?.numberFailedCharges?.numberFailedCharges &&
                  member.numberFailedCharges.numberFailedCharges
                )}
                {member?.numberFailedCharges?.numberFailedCharges &&
                member.numberFailedCharges.numberFailedCharges > 1
                  ? ' in a row'
                  : ''}
              </div>
            </Info>
          </Flex>
        </InfoSection>
      </Loadable>
    </InfoContainer>
  )
}
