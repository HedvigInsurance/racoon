import styled from '@emotion/styled'
import {
  Button,
  ErrorText,
  Flex,
  Label,
  Modal,
  Popover,
  StandaloneMessage,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import chroma from 'chroma-js'
import { format, parseISO } from 'date-fns'
import { UpdateQuoteForm } from '@hope/features/member/tabs/quote-tab/components/UpdateQuoteForm'
import { SchemaDataSummary } from '@hope/features/member/tabs/quote-tab/utils'
import { useState } from 'react'
import * as React from 'react'
import { Contract, Quote } from 'types/generated/graphql'
import { QuoteActivation } from './QuoteActivation'
import { QuoteContractCreation } from './QuoteContractCreation'
import { QuotePrice } from './QuotePrice'
import { useConfirmDialog } from '@hedvig-ui'
import {
  getContractByAgreementId,
  getOriginatingAgreement,
} from '@hope/features/contracts/utils'

const ActionsWrapper = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  border-radius: 0.5rem;

  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.25rem 0.7rem;

  margin: 0 1rem 1rem 0;

  > div {
    width: 100%;
    padding: 0.5rem;
  }
`

const OuterWrapper = styled.div`
  width: 100%;
`

const BreachedUnderwritingGuidelines = styled.div`
  color: ${({ theme }) => theme.danger};
  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.5rem 0.7rem;
  margin: 0 1rem 1rem 0;
  border-radius: 0.5rem;

  label:first-of-type {
    margin: 0.5rem;
    margin-bottom: 0;
    width: 100%;
  }

  > div {
    margin: 0.5rem;
  }
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`

const ActionsButtonsWrapper = styled.div`
  flex-shrink: 1;
`

const DataWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.25rem 0.7rem;

  margin: 0 1rem 1rem 0;

  border-radius: 0.5rem;

  > div {
    width: 100%;
    padding: 0.5rem;
  }

  .created-at {
    width: 40%;
  }

  .next-to-created-at {
    width: 60%;
  }

  .street {
    width: 40%;
  }

  .zipCode {
    width: 30%;
  }

  .city {
    width: 30%;
  }

  .numberCoInsured {
    width: 40%;
  }

  .isStudent {
    width: 30%;
  }
`

enum Action {
  ACTIVATE,
  MODIFY,
  SIGN,
}

const QuoteGeneralInfo: React.FC<{
  quote: Quote
  quoteContract: Contract | undefined
}> = ({ quote, quoteContract }) => (
  <div style={{ width: '100%' }}>
    {quote.price && (
      <DataWrapper>
        <QuotePrice quote={quote} />
      </DataWrapper>
    )}
    {(quote.breachedUnderwritingGuidelines?.length || 0) > 0 && (
      <div>
        <BreachedUnderwritingGuidelines>
          <Label>Breached underwriting guidelines</Label>
          {quote.breachedUnderwritingGuidelines?.map((guideline) => (
            <BreachedGuidelineTag key={guideline}>
              {convertEnumToTitle(guideline)}
            </BreachedGuidelineTag>
          )) ?? []}
        </BreachedUnderwritingGuidelines>
      </div>
    )}
    <DataWrapper>
      <div className="created-at">
        <Label>Created</Label>
        <div>{format(parseISO(quote.createdAt), 'yyyy-MM-dd HH:mm')}</div>
      </div>
      {quote.signedAt && (
        <div className="next-to-created-at">
          <Label>Signed at</Label>
          <div>{format(parseISO(quote.signedAt), 'yyyy-MM-dd HH:mm')}</div>
        </div>
      )}
      <div className={quote.signedAt ? '' : 'next-to-created-at'}>
        <Label>State</Label>
        <div>{quote.state ? convertEnumToTitle(quote.state) : '-'}</div>
      </div>
      <div className="created-at">
        <Label>StartDate</Label>
        <div>
          {quote.startDate ? (
            quote.startDate
          ) : (
            <span style={{ color: 'red' }}>***Missing***</span>
          )}
        </div>
      </div>
      <div className="created-at">
        <Label>Type of quote</Label>
        <div>
          {quote.originatingProductId ? (
            quote.initiatedFrom === 'RENEWAL' ? (
              <span style={{ color: 'red' }}>Renewal</span>
            ) : (
              <span style={{ color: 'blue' }}>Mid-term change</span>
            )
          ) : (
            <span style={{ color: 'green' }}>New</span>
          )}
        </div>
      </div>
      {quoteContract ? (
        <div className="created-at">
          <Label>Contract</Label>
          <div>{quoteContract?.id}</div>
        </div>
      ) : (
        <div />
      )}
    </DataWrapper>
  </div>
)

export const QuoteListItem: React.FC<{
  contracts: ReadonlyArray<Contract>
  quote: Quote
  inactionable?: boolean
  memberId: string
}> = ({ contracts, quote, inactionable, memberId }) => {
  const { confirm } = useConfirmDialog()
  const [showDebug, setShowDebug] = useState(false)
  const [action, setAction] = useState<Action | null>(null)
  const [isWip, setIsWip] = useState(false)

  const quoteContract = quote.originatingProductId
    ? getContractByAgreementId(contracts, quote.originatingProductId)
    : undefined

  const toggleState = (targetAction: Action) => () => {
    const isTransitionToOpen = action === null
    if (isTransitionToOpen) {
      setAction(targetAction)
      return
    }

    const isTransitionToClose = action === targetAction
    if (isTransitionToClose) {
      if (!isWip) {
        confirm('Any changes will get lost. Do you want to continue?')
        setAction(null)
      }
      return
    }

    const isTransitionToOther = true
    if (isTransitionToOther) {
      if (!isWip) {
        confirm('Any changes will get lost. Do you want to continue?')
        setAction(targetAction)
        return
      }
    }

    throw Error(
      'Illegal state! This should never happen, please file a report to the ministry of logic',
    )
  }

  return (
    <OuterWrapper>
      <Flex fullWidth>
        <div style={{ width: '100%' }}>
          <QuoteGeneralInfo quote={quote} quoteContract={quoteContract} />
          {action === Action.ACTIVATE ? (
            <ActionsWrapper>
              {quoteContract ? (
                <QuoteActivation
                  quoteId={quote.id}
                  contract={quoteContract}
                  agreement={getOriginatingAgreement(
                    quoteContract!,
                    quote!.originatingProductId!,
                  )}
                  onWipChange={setIsWip}
                  onSubmitted={() => {
                    setIsWip(false)
                    setAction(null)
                  }}
                />
              ) : (
                <StandaloneMessage>
                  Cannot activate without connected contract
                </StandaloneMessage>
              )}
            </ActionsWrapper>
          ) : action === Action.SIGN ? (
            <ActionsWrapper>
              <QuoteContractCreation
                quote={quote}
                memberId={memberId}
                onWipChange={setIsWip}
              />
            </ActionsWrapper>
          ) : action === Action.MODIFY ? (
            <ActionsWrapper>
              <UpdateQuoteForm
                quote={quote}
                agreement={
                  getOriginatingAgreement(
                    quoteContract!,
                    quote!.originatingProductId!,
                  )!
                }
                contract={quoteContract!}
                onCancel={() => {
                  confirm('Do you really want to cancel modifying?').then(
                    () => {
                      setIsWip(false)
                      setAction(null)
                    },
                  )
                }}
                onSubmitted={() => {
                  setIsWip(false)
                  setAction(null)
                }}
              />
            </ActionsWrapper>
          ) : (
            <DataWrapper>
              <SchemaDataSummary schemaData={quote.schemaData} />
            </DataWrapper>
          )}
        </div>
        <ActionsButtonsWrapper>
          {!!inactionable || (
            <>
              {!quote.isReadyToSign ? (
                <div style={{ paddingBottom: '1rem' }}>
                  <Popover
                    contents={quoteContract ? null : 'No contract connected'}
                  >
                    <Button
                      disabled={
                        !quoteContract ||
                        !quote.startDate ||
                        quote.initiatedFrom === 'RENEWAL'
                      }
                      style={{ width: '100%' }}
                      onClick={toggleState(Action.ACTIVATE)}
                    >
                      Activate
                    </Button>
                  </Popover>
                </div>
              ) : contracts.length > 0 ? (
                <div style={{ paddingBottom: '1rem' }}>
                  <Button
                    disabled={!quote.startDate}
                    style={{ width: '100%' }}
                    onClick={toggleState(Action.SIGN)}
                  >
                    Sign
                  </Button>
                </div>
              ) : (
                <ErrorText>Member has to sign first contract</ErrorText>
              )}
              <div style={{ paddingBottom: '1rem' }}>
                <Button
                  disabled={quote.initiatedFrom === 'RENEWAL'}
                  style={{ width: '100%' }}
                  variant="secondary"
                  onClick={toggleState(Action.MODIFY)}
                >
                  Modify
                </Button>
              </div>
            </>
          )}
          <Button
            style={{ width: '100%' }}
            variant="tertiary"
            onClick={() => setShowDebug(true)}
          >
            Debug info
          </Button>
          <Modal
            visible={showDebug}
            onClose={() => setShowDebug(false)}
            style={{ padding: '1rem' }}
          >
            Quote ID: {quote.id} <br />
            Originating Product ID: {quote.originatingProductId} <br />
          </Modal>
        </ActionsButtonsWrapper>
      </Flex>
    </OuterWrapper>
  )
}
