import { Button, Heading, InputField, Space } from 'ui'
import React, { useEffect, useState } from 'react'
import { useCreateQuoteBundleMutation, useCreateQuoteCartMutation } from '@/services/apollo/types'

import { Switch } from './switch'
import { useCurrentLocale } from '@/lib/l10n'

export const SsnInputForm = () => {
  const [ssnValue, setSsnValue] = useState('')
  const [isCurrentAddress, setIsCurrentAddress] = useState(true)
  const { apiMarket, isoLocale } = useCurrentLocale()
  const [createQuoteCart, { data: quoteCartData, error: quoteCartError }] =
    useCreateQuoteCartMutation({
      variables: { market: apiMarket, locale: isoLocale },
    })
  const quoteCartId = quoteCartData?.onboardingQuoteCart_create.id
  const [
    createQuoteBundle,
    { data: quoteBundleData, loading: isLoadingQuoteBundle, error: quoteBundleError },
  ] = useCreateQuoteBundleMutation({
    variables: {
      id: quoteCartId || '',
      input: { ssn: ssnValue, isStudent: false },
    },
  })

  useEffect(() => {
    if (!quoteCartId) {
      createQuoteCart()
    }
  }, [quoteCartId, createQuoteCart])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const nonNumbersRegex = /\D/
    const ssn = value.replace(nonNumbersRegex, '')
    setSsnValue(ssn)
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (ssnValue.length !== 12) {
      return
    }
    createQuoteBundle()
  }

  const handleCheckboxChange = () => {
    setIsCurrentAddress(!isCurrentAddress)
  }

  const quoteBundle = quoteBundleData?.quoteCart_createSwedishBundle
  const hasQuoteBundle = Boolean(quoteBundle) && quoteBundle?.__typename === 'QuoteCart'

  if (isLoadingQuoteBundle) {
    return <div>Loading...</div>
  }

  if (hasQuoteBundle) {
    return (
      <>
        {quoteBundle.bundle?.quotes.map(({ id }) => (
          <div key={id}>Quote ID: {id}</div>
        ))}
      </>
    )
  }

  return (
    <>
      {(quoteBundleError || (quoteBundleData && !hasQuoteBundle)) && (
        <Heading variant="xs" headingLevel="h3" colorVariant="dark">
          {"Couldn't create quote, please try again"}
        </Heading>
      )}
      <form onSubmit={handleSubmit} id="ssn-form">
        <InputField
          label="Personnummer"
          placeholder="YYYYMMDDXXXX"
          required
          value={ssnValue}
          name="ssn"
          onChange={handleInputChange}
        />
      </form>
      <Space y={3}>
        <Switch
          isChecked={isCurrentAddress}
          onChange={handleCheckboxChange}
          labelText="Jag vill ha prisförslag för min nuvarande adress"
        />
        <Button type="submit" onClick={handleSubmit} $hasFullWidth disabled={!isCurrentAddress}>
          Hämta uppgifter - se ditt pris
        </Button>
      </Space>
    </>
  )
}
