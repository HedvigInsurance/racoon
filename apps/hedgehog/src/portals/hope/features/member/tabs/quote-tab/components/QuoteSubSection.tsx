import {
  Button,
  Card,
  CardsWrapper,
  Flex,
  MainHeadline,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { InsuranceType } from '@hope/features/config/constants'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import {
  isExpired,
  isSigned,
  isSignedOrExpired,
} from '@hope/features/member/tabs/quote-tab/utils'
import { useState } from 'react'
import * as React from 'react'
import { Quote } from 'types/generated/graphql'
import { QuoteListItem } from './QuoteListItem'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { CreateQuoteModal } from '@hope/features/member/tabs/quote-tab/components/CreateQuoteModal'

export const Muted = styled.div`
  opacity: 0.7;
`

const MutedInfo = styled.div<{ visible?: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  margin-top: 0.25rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(0.8).hex()};
  font-size: 0.75rem;
  text-align: center;
  max-width: 10rem;
`

export const QuotesSubSection: React.FC<{
  memberId: string
  insuranceType: InsuranceType
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, insuranceType, quotes }) => {
  const [isWip, setIsWip] = useState(false)
  const [contracts, { loading }] = useContracts(memberId)

  if (loading) {
    return null
  }

  const activeQuotes = quotes.filter((quote) => !isSignedOrExpired(quote))

  const signedQuotes = quotes.filter(isSigned)
  const expiredQuotes = quotes.filter(isExpired)

  const hasActiveContracts =
    contracts.filter(
      (contract) =>
        (contract.insuranceType as InsuranceType) === insuranceType &&
        !contract.terminationDate &&
        !contract.deletedAt,
    ).length > 0

  const insuranceTypesApplicableForMultipleQuotes = [
    InsuranceType.SwedishCar,
    InsuranceType.SwedishObjectlegacy,
    InsuranceType.SwedishCat,
    InsuranceType.SwedishDog,
  ]

  const shouldDisableCreateQuoteButton =
    hasActiveContracts &&
    !insuranceTypesApplicableForMultipleQuotes.includes(insuranceType)

  return (
    <div style={{ paddingBottom: '7rem' }}>
      <Flex justify="space-between" style={{ marginBottom: '2rem' }}>
        <MainHeadline>Quotes</MainHeadline>
        <div>
          <Button
            variant="primary"
            disabled={shouldDisableCreateQuoteButton}
            style={{ width: '10rem' }}
            onClick={() => setIsWip(!isWip)}
          >
            Create quote
          </Button>

          <MutedInfo visible={shouldDisableCreateQuoteButton}>
            There's an active contract
          </MutedInfo>
        </div>
      </Flex>
      <CreateQuoteModal
        insuranceType={insuranceType}
        memberId={memberId}
        onClose={() => {
          setIsWip(false)
        }}
        visible={isWip}
      />
      {!activeQuotes.length ? (
        <StandaloneMessage paddingTop="7rem" paddingBottom="5rem">
          <div style={{ textAlign: 'center', fontSize: '1.4rem' }}>
            No pending quotes
          </div>
        </StandaloneMessage>
      ) : (
        <>
          <CardsWrapper>
            {activeQuotes.map((quote) => (
              <Card key={quote.id}>
                <QuoteListItem
                  quote={quote}
                  memberId={memberId}
                  contracts={contracts}
                />
              </Card>
            ))}
          </CardsWrapper>
        </>
      )}

      <ThirdLevelHeadline style={{ marginTop: '4rem' }}>
        Signed
      </ThirdLevelHeadline>
      {!signedQuotes.length ? (
        <StandaloneMessage paddingTop="7rem" paddingBottom="5rem">
          <div style={{ textAlign: 'center', fontSize: '1.4rem' }}>
            No signed quotes
          </div>
        </StandaloneMessage>
      ) : (
        <>
          <Muted>
            <CardsWrapper>
              {signedQuotes.map((quote) => (
                <Card key={quote.id}>
                  <QuoteListItem
                    quote={quote}
                    memberId={memberId}
                    contracts={contracts}
                    inactionable
                  />
                </Card>
              ))}
            </CardsWrapper>
          </Muted>
        </>
      )}

      <ThirdLevelHeadline style={{ marginTop: '4rem' }}>
        Expired
      </ThirdLevelHeadline>
      {!expiredQuotes.length ? (
        <StandaloneMessage paddingTop="7rem" paddingBottom="5rem">
          <div style={{ textAlign: 'center', fontSize: '1.4rem' }}>
            No expired quotes
          </div>
        </StandaloneMessage>
      ) : (
        <>
          <Muted>
            <CardsWrapper>
              {expiredQuotes.map((quote) => (
                <Card key={quote.id}>
                  <QuoteListItem
                    quote={quote}
                    memberId={memberId}
                    contracts={contracts}
                    inactionable
                  />
                </Card>
              ))}
            </CardsWrapper>
          </Muted>
        </>
      )}
    </div>
  )
}
