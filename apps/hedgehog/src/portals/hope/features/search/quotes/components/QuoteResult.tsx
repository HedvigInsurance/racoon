import { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import {
  Quote,
  QuoteSearchHit,
  useQuoteSearchQuoteQuery,
} from 'types/generated/graphql'
import {
  Button,
  Flex,
  Label,
  Loadable,
  Modal,
  PrettyPrintJSON,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import { formatDate } from 'date-fns/format'
import { convertEnumOrSentenceToTitle, convertEnumToTitle } from '@hedvig-ui'

const Wrapper = styled.div`
  max-width: 60rem;
  padding: 2rem;
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).alpha(0.05).hex()};

  h3 {
    font-size: 1.6rem;
    margin-bottom: 0;
  }

  h4 {
    margin-bottom: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .type {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(0.5).hex()};
    font-size: 1.1rem;
    margin-bottom: 0;
  }

  .type-placeholder {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    font-size: 1.1rem;
    margin-bottom: 0;
  }

  .name {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .name-placeholder {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1.75).hex()};
  }

  .labeled-information {
    min-width: 8rem;
    margin-bottom: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .labeled-information-placeholder {
    min-width: 8rem;
    margin-bottom: 0;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1.75).hex()};
  }

  .price {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  margin-bottom: 2rem;
  border-radius: 0.25rem;
`

gql`
  query QuoteSearchQuote($id: String!) {
    quote(id: $id) {
      id
      price
      currency
      createdAt
      memberId
      state
      productType
      breachedUnderwritingGuidelines
      schemaData
    }
  }
`

const SmallLabel = styled(Label)`
  font-size: 0.8rem;
  margin-bottom: -0.2rem;
  margin-top: 0.2rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-align: center;
`

export const QuoteResult = ({
  quote: quoteSearchHit,
}: {
  quote: QuoteSearchHit
}) => {
  const { data, loading } = useQuoteSearchQuoteQuery({
    variables: { id: quoteSearchHit.id ?? '' },
  })

  const { quote } = data ?? {}

  const price = quote?.price
  const currency = quote?.currency
  const createdAt = quote?.createdAt
  const state = quote?.state
  const productType = quote?.productType
  const breachedGuidelines = quote?.breachedUnderwritingGuidelines ?? []
  const registrationNumber = quote?.schemaData?.registrationNumber

  const geoInfo = [
    quoteSearchHit?.street,
    quoteSearchHit?.city,
    quoteSearchHit?.postalCode,
  ].filter(Boolean)

  return (
    <Wrapper>
      <Flex justify="space-between">
        <Flex direction="column" gap="tiny">
          <div>{quoteSearchHit.id}</div>
          {productType ? (
            <div className="type">
              {convertEnumOrSentenceToTitle(productType)}
            </div>
          ) : (
            <div className="type-placeholder">No product type</div>
          )}

          {typeof quoteSearchHit.fullName == 'string' &&
          quoteSearchHit.fullName.trim().length > 0 ? (
            <div className="name">{quoteSearchHit.fullName}</div>
          ) : (
            <div className="name-placeholder">Name not available</div>
          )}

          <Flex>
            <div>
              <SmallLabel>SSN</SmallLabel>
              {quoteSearchHit.ssn ? (
                <div className="labeled-information">{quoteSearchHit.ssn}</div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>Member ID</SmallLabel>
              {quoteSearchHit?.memberId ? (
                <div className="labeled-information">
                  <a href={`/members/${quoteSearchHit.memberId}`}>
                    {quoteSearchHit.memberId}
                  </a>
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>Created at</SmallLabel>
              {createdAt ? (
                <div className="labeled-information">
                  {formatDate(new Date(createdAt), 'yyyy-MM-dd')}
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>State</SmallLabel>
              {state ? (
                <div className="labeled-information">
                  {convertEnumOrSentenceToTitle(state)}
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            {registrationNumber && (
              <div style={{ marginLeft: '2rem' }}>
                <SmallLabel>Registration number</SmallLabel>

                <div className="labeled-information">
                  {registrationNumber.toUpperCase()}
                </div>
              </div>
            )}
          </Flex>

          <Flex>
            <div>
              <SmallLabel>Address</SmallLabel>
              {geoInfo.length !== 0 ? (
                <div className="labeled-information">{geoInfo.join(', ')}</div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            {breachedGuidelines.length !== 0 && (
              <div style={{ marginLeft: '2rem' }}>
                <SmallLabel>Breached guidelines</SmallLabel>
                <Flex>
                  {breachedGuidelines.map((guideline) => (
                    <BreachedGuidelineTag key={guideline + quoteSearchHit.id}>
                      {convertEnumToTitle(guideline)}
                    </BreachedGuidelineTag>
                  ))}
                </Flex>
              </div>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" justify="space-between" align="flex-end">
          <Loadable loading={loading || !price || !currency}>
            <div className="price">
              {price ?? '123'} {currency ?? 'ABC'}
            </div>
          </Loadable>
          {quote && <QuoteResultActions quote={quote} />}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

const QuoteResultActions = ({
  quote,
}: {
  quote: Pick<Quote, 'id' | 'state' | 'createdAt'>
}) => {
  const [isDebugVisible, setDebugVisible] = useState(false)

  const showDebug = useCallback(() => setDebugVisible(true), [])
  const hideDebug = useCallback(() => setDebugVisible(false), [])

  return (
    <>
      <Button variant="tertiary" onClick={showDebug}>
        Debug info
      </Button>
      <Modal visible={isDebugVisible} onClose={hideDebug}>
        <ModalContent>
          <Flex gap="small">
            <PrettyPrintJSON
              obj={quote}
              name={'Quote debug info'}
              collapsed={1}
            />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}

const ModalContent = styled.div`
  min-width: 40rem;
  min-height: 20rem;
`
