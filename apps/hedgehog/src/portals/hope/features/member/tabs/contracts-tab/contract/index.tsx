import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  convertEnumToTitle,
  FourthLevelHeadline,
  InfoContainer,
  InfoRow,
  InfoText,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { Agreement } from '@hope/features/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from '@hope/features/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from '@hope/features/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from '@hope/features/member/tabs/contracts-tab/contract/termination-date'
import { getSignSource } from '@hope/features/contracts/utils'
import * as React from 'react'
import { Contract as ContractType } from 'types/generated/graphql'
import { InsurableLimitsInfo } from '../agreement/InsurableLimitsInfo'

const ContractWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

export const Contract: React.FC<{
  contract: ContractType
  onRefetch: () => void
  shouldPreSelectAgreement: boolean
}> = ({ contract, onRefetch, shouldPreSelectAgreement }) => {
  const [selectedAgreement, setSelectedAgreement] = React.useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreement.id : undefined)

  const agreementToShow = contract.genericAgreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  const currentAgreement = contract.genericAgreements.find(
    ({ id }) => id === contract.currentAgreement.id,
  )

  return (
    <ContractWrapper>
      <CardsWrapper style={{ flexWrap: 'nowrap' }}>
        <Card
          locked={contract.isLocked}
          deleted={contract.status === 'DELETED'}
          span={4}
        >
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>{convertEnumToTitle(contract.insuranceType)}</InfoRow>
            </ThirdLevelHeadline>
            {!!currentAgreement?.name && (
              <InfoRow>
                Pet Name <InfoText>{currentAgreement.name}</InfoText>
              </InfoRow>
            )}
            {(!!contract.holderMember.firstName ||
              !!contract.holderMember.lastName) && (
              <InfoRow>
                Holder{' '}
                <InfoText>
                  {contract.holderMember.firstName}{' '}
                  {contract.holderMember.lastName}
                </InfoText>
              </InfoRow>
            )}
            <InfoRow>
              Status <InfoText>{convertEnumToTitle(contract.status)}</InfoText>
            </InfoRow>
            {contract.switchedFrom && (
              <InfoRow>
                Switched From
                <InfoText>{contract.switchedFrom.toUpperCase()}</InfoText>
              </InfoRow>
            )}
            {contract.signSource && (
              <InfoRow>
                Sign Source{' '}
                <InfoText>{getSignSource(contract.signSource)}</InfoText>
              </InfoRow>
            )}
            {currentAgreement?.partner && (
              <InfoRow>
                Partner{' '}
                <InfoText>
                  {convertEnumToTitle(currentAgreement.partner)}
                </InfoText>
              </InfoRow>
            )}
            {currentAgreement?.registrationNumber && (
              <InfoRow>
                Car <InfoText>{currentAgreement.registrationNumber}</InfoText>
              </InfoRow>
            )}
          </InfoContainer>
        </Card>
        <Card
          locked={contract.isLocked}
          deleted={contract.status === 'DELETED'}
          span={4}
        >
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
          {contract.renewal?.renewalDate && (
            <>
              <ThirdLevelHeadline>Renewal Date</ThirdLevelHeadline>
              <FourthLevelHeadline>
                {contract.renewal.renewalDate}
              </FourthLevelHeadline>
            </>
          )}
        </Card>
        {contract.insurableLimits?.length > 0 && (
          <Card span={4}>
            <InsurableLimitsInfo contract={contract} />
          </Card>
        )}
        <Card
          locked={contract.isLocked}
          deleted={contract.status === 'DELETED'}
          span={4}
        >
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>Termination</InfoRow>
            </ThirdLevelHeadline>
            <TerminationDate contract={contract} />
          </InfoContainer>
        </Card>
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.genericAgreements}
        selectedAgreement={selectedAgreement}
        setSelectedAgreement={setSelectedAgreement}
        isContractDeleted={contract.status === 'DELETED'}
        isContractLocked={contract.isLocked}
      />
      {agreementToShow && (
        <Agreement
          agreement={agreementToShow}
          contract={contract}
          onRefetch={onRefetch}
        />
      )}
    </ContractWrapper>
  )
}
