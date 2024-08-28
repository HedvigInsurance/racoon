import { useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import {
  Button,
  ConfirmingButton,
  convertEnumToTitle,
  Flex,
  FourthLevelHeadline,
  Modal,
  ModalProps,
  SecondLevelHeadline,
  Spinner,
} from '@hedvig-ui'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import {
  GetContractsDocument,
  MemberQuotesDocument,
  useCreateQuoteFromAgreementMutation,
} from 'types/generated/graphql'
import { useMemberQuotes } from '@hope/features/member/tabs/quote-tab/hooks/use-member-quotes'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ContractMarketTypes,
  InsuranceType,
  Market,
} from '@hope/features/config/constants'
import { CreateQuoteModal } from '@hope/features/member/tabs/quote-tab/components/CreateQuoteModal'
import { isExpired } from '@hope/features/member/tabs/quote-tab/utils'

const QuoteWrapper = styled.div`
  padding: 2rem;
  min-width: 30rem;
  overflow-x: hidden;
`

export const CreateQuotesModal: React.FC<
  {
    memberId: string
  } & ModalProps
> = ({ memberId, ...modalProps }) => {
  const [contracts] = useContracts(memberId)

  const activeContracts = contracts.filter(
    (contract) => !contract.terminationDate && !contract.isLocked,
  )
  const [insuranceType, setInsuranceType] = useState<InsuranceType | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [createQuote] = useCreateQuoteFromAgreementMutation()
  const [{ quotes }] = useMemberQuotes(memberId)

  const market = contracts.length === 0 ? undefined : contracts[0].market

  const navigateQuote = (insuranceType: InsuranceType) => {
    if (location.pathname.includes('/members/')) {
      return navigate(
        `/members/${memberId}/quotes?insuranceType=${insuranceType}`,
      )
    }
    const params = new URLSearchParams(location.search)
    params.delete('active')
    params.delete('tab')
    params.delete('insuranceType')
    const updated = `${params}&active=${memberId}&tab=quotes&insuranceType=${insuranceType}`
    navigate(`${location.pathname}?${updated}`)
    modalProps.onClose()
  }

  return (
    <>
      {insuranceType ? (
        <CreateQuoteModal
          onClose={() => setInsuranceType(null)}
          onSubmit={() => {
            navigateQuote(insuranceType)
            modalProps.onClose()
          }}
          memberId={memberId}
          insuranceType={insuranceType}
          visible={true}
        />
      ) : (
        <Modal {...modalProps}>
          <QuoteWrapper>
            <SecondLevelHeadline style={{ marginBottom: '2rem' }}>
              Create Quote
            </SecondLevelHeadline>
            <Flex direction="column" gap="tiny">
              {!market ? (
                <Spinner />
              ) : (
                ContractMarketTypes[market as Market].map((insuranceType) => {
                  const relevantContracts = activeContracts.filter(
                    (contract) => contract.insuranceType === insuranceType,
                  )
                  const currentContract =
                    relevantContracts.length === 1 ? relevantContracts[0] : null
                  if (currentContract) {
                    const selectAgreement = currentContract.currentAgreement
                    const quoteAlreadyExists = !quotes
                      ? false
                      : quotes
                          .filter(
                            (quote) =>
                              quote.state === 'QUOTED' && !isExpired(quote),
                          )
                          .map((quote) => quote.originatingProductId)
                          .includes(selectAgreement.id)
                    if (quoteAlreadyExists) {
                      return (
                        <Flex key={insuranceType} gap="small" align="center">
                          <Button disabled>
                            {convertEnumToTitle(currentContract.insuranceType)}
                          </Button>
                          <Button
                            size="small"
                            variant="tertiary"
                            onClick={() => {
                              navigateQuote(
                                currentContract.insuranceType as InsuranceType,
                              )
                            }}
                          >
                            Quote already exists ↗
                          </Button>
                        </Flex>
                      )
                    }
                    return (
                      <Flex key={insuranceType} gap="small">
                        <ConfirmingButton
                          onClick={async () => {
                            await toast.promise(
                              createQuote({
                                variables: {
                                  agreementId: selectAgreement?.id,
                                  memberId: memberId,
                                },
                                refetchQueries: [
                                  {
                                    query: MemberQuotesDocument,
                                    variables: { memberId },
                                  },
                                  {
                                    query: GetContractsDocument,
                                    variables: { memberId },
                                  },
                                ],
                              }),
                              {
                                loading: 'Creating quote',
                                success: () => {
                                  navigateQuote(
                                    currentContract.insuranceType as InsuranceType,
                                  )
                                  return 'Quote created'
                                },
                                error: 'Could not create quote',
                              },
                            )
                          }}
                        >
                          {convertEnumToTitle(currentContract.insuranceType)}
                        </ConfirmingButton>
                        <div>
                          <FourthLevelHeadline>
                            <strong>
                              {selectAgreement.name ??
                                selectAgreement.registrationNumber ??
                                selectAgreement.objectTitle ??
                                selectAgreement.address?.street}
                            </strong>
                          </FourthLevelHeadline>
                          <span
                            style={{ fontSize: '1rem', marginRight: '1rem' }}
                          >
                            {currentContract.masterInception}
                          </span>
                        </div>
                      </Flex>
                    )
                  }

                  return (
                    <div key={insuranceType}>
                      <Button
                        variant="secondary"
                        status={
                          relevantContracts.length === 0 ? undefined : 'danger'
                        }
                        onClick={() => setInsuranceType(insuranceType)}
                      >
                        {convertEnumToTitle(insuranceType)}
                        {relevantContracts.length > 0 &&
                          `(${relevantContracts.length} contracts)`}
                      </Button>
                    </div>
                  )
                })
              )}
            </Flex>
          </QuoteWrapper>
        </Modal>
      )}
    </>
  )
}
