import {
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  LoadingMessage,
  StandaloneMessage,
  useSearchParamsState,
} from '@hedvig-ui'
import {
  ContractMarketTypes,
  InsuranceType,
  Market,
  PickedLocale,
  PickedLocaleMarket,
  QuoteProductType,
  QuoteProductTypeContractMap,
} from '@hope/features/config/constants'
import { useMemberQuotes } from '@hope/features/member/tabs/quote-tab/hooks/use-member-quotes'
import { useEffect } from 'react'
import * as React from 'react'
import { Quote } from 'types/generated/graphql'
import { QuotesSubSection } from './components/QuoteSubSection'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'

export const QuotesTab: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [activeTab, setActiveTab] = useSearchParamsState('insuranceType', '')
  const [{ quotes, contractMarket, pickedLocale }, { loading }] =
    useMemberQuotes(memberId)

  const [contracts] = useContracts(memberId)

  useEffect(() => {
    if (!contracts || !contracts.length) return
    if (activeTab) return
    setActiveTab(contracts[0].insuranceType)
  }, [activeTab, setActiveTab, contracts])

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (!quotes?.length) {
    return <StandaloneMessage paddingTop="10vh">No quotes</StandaloneMessage>
  }

  const memberMarket: string | undefined = contractMarket?.market
    ? contractMarket.market
    : pickedLocale && PickedLocaleMarket[pickedLocale as PickedLocale]

  if (!memberMarket) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Unable to get any market info, please contact Tech
      </StandaloneMessage>
    )
  }

  return (
    <>
      <Dropdown style={{ marginBlock: '1rem' }}>
        {ContractMarketTypes[memberMarket as Market].map((type) => (
          <DropdownOption
            key={type}
            onClick={() => setActiveTab(type)}
            selected={type === activeTab}
          >
            {convertEnumToTitle(type)} (
            {getCategorisedQuotesBasedOnInsuranceType(quotes, type).length})
          </DropdownOption>
        ))}
      </Dropdown>

      {!!quotes.length && activeTab && (
        <QuotesSubSection
          memberId={memberId}
          insuranceType={activeTab as InsuranceType}
          quotes={getCategorisedQuotesBasedOnInsuranceType(quotes, activeTab)}
        />
      )}
    </>
  )
}

function getCategorisedQuotesBasedOnInsuranceType(
  quotes: Quote[],
  insuranceType: string,
): Quote[] {
  return quotes.filter(
    (quote) =>
      !!quote.productType &&
      QuoteProductTypeContractMap[
        quote.productType as QuoteProductType
      ].includes(insuranceType as InsuranceType),
  )
}
