import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  InfoRow,
  InfoText,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import { AgreementInfo } from '@hope/features/member/tabs/contracts-tab/agreement/AgreementInfo'
import { FromDate } from '@hope/features/member/tabs/contracts-tab/agreement/FromDate'
import { InsuranceCertificate } from '@hope/features/member/tabs/contracts-tab/agreement/InsuranceCertificate'
import { ContractSwitching } from '@hope/features/member/tabs/contracts-tab/agreement/ContractSwitching'
import { TermsAndConditions } from '@hope/features/member/tabs/contracts-tab/agreement/TermsAndConditions'
import { ToDate } from '@hope/features/member/tabs/contracts-tab/agreement/ToDate'
import * as React from 'react'
import { useState } from 'react'
import { InsuranceType } from '@hope/features/config/constants'
import {
  Contract,
  GenericAgreement as AgreementType,
  useMemberNameAndContractMarketInfoQuery,
} from 'types/generated/graphql'
import { CreateQuoteFromAgreement } from './CreateQuoteFromAgreement'
import { TravelCertificates } from './TravelCertificates/TravelCertificates'
import { Events } from '@hope/features/member/tabs/contracts-tab/agreement/Events'

const Divider = styled.hr`
  background: transparent;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.borderStrong};
  margin: 2rem 0;
  height: 0;
  width: 100%;
`

const Headline = styled(ThirdLevelHeadline)`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  & a {
    font-size: 1rem;
  }
`

const contractIncludesTravelInsurance = (contract: Contract) => {
  const travelTypes = [
    InsuranceType.SwedishApartment,
    InsuranceType.SwedishHouse,
  ]
  return travelTypes.includes(contract.insuranceType as InsuranceType)
}

export const Agreement: React.FC<{
  agreement: AgreementType
  contract: Contract
  onRefetch: () => void
}> = ({ agreement, contract, onRefetch }) => {
  const memberId = contract.holderMember.memberId
  const { data } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })
  const preferredCurrency = data?.member?.contractMarketInfo?.preferredCurrency
  const [showEvents, setShowEvents] = useState(false)

  return (
    <>
      <CardsWrapper>
        <Card span={2}>
          <AgreementInfo
            agreement={agreement}
            preferredCurrency={preferredCurrency}
          />
        </Card>
        {agreement.status !== 'PENDING' && (
          <>
            <Card span={2}>
              <FromDate agreement={agreement} contract={contract} />
              <Divider />
              <div>
                <ToDate agreement={agreement} contract={contract} />
              </div>
            </Card>
            <Card>
              <InsuranceCertificate
                agreement={agreement}
                onRefetch={onRefetch}
              />
            </Card>
            {contractIncludesTravelInsurance(contract) && (
              <Card>
                <TravelCertificates contract={contract} />
              </Card>
            )}

            <Card span={2}>
              {agreement.termsAndConditions ? (
                <TermsAndConditions
                  termsAndConditions={agreement.termsAndConditions}
                />
              ) : (
                <>
                  <Headline>
                    <span>Terms and Conditions</span>
                  </Headline>
                  <InfoRow>Unable to fetch Terms and Conditions</InfoRow>
                </>
              )}
            </Card>
          </>
        )}
        <Card span={2}>
          <CreateQuoteFromAgreement agreement={agreement} contract={contract} />
        </Card>

        <Card span={2}>
          <ContractSwitching contract={contract} />
        </Card>

        <Card span={2}>
          <ThirdLevelHeadline>Debugging</ThirdLevelHeadline>
          <InfoRow>
            Member Id <InfoText>{contract.holderMember.memberId}</InfoText>
          </InfoRow>
          <InfoRow>
            Contract Id
            <InfoText>{contract.id}</InfoText>
          </InfoRow>
          <InfoRow>
            Contract created at{' '}
            <InfoText>
              {format(parseISO(contract.createdAt), 'yyyy-MM-dd HH:mm:ss')}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Agreement Id <InfoText>{agreement.id}</InfoText>
          </InfoRow>
          <InfoRow>
            Agreement created at{' '}
            <InfoText>
              {format(parseISO(agreement.createdAt), 'yyyy-MM-dd HH:mm:ss')}
            </InfoText>
          </InfoRow>
        </Card>
      </CardsWrapper>

      {showEvents ? (
        <CardsWrapper>
          <Card span={2}>
            <Button
              style={{ marginInline: 'auto' }}
              variant="tertiary"
              onClick={() => setShowEvents(false)}
            >
              Hide events
            </Button>
            <Events contractId={contract.id} />
          </Card>
        </CardsWrapper>
      ) : (
        <Button variant="tertiary" onClick={() => setShowEvents(true)}>
          Show events
        </Button>
      )}
    </>
  )
}
