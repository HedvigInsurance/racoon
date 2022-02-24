import { Button, Heading, InputField, Space } from 'ui'
import React, { useEffect, useState } from 'react'
import { useCreateQuoteBundleMutation, useCreateQuoteCartMutation } from '@/services/apollo/types'

import LoadingPage from '../loading.page'
import { PageLink } from '@/lib/page-link'
import ReactDOM from 'react-dom'
import { Switch } from './switch'
import styled from '@emotion/styled'
import { useCurrentLocale } from '@/lib/l10n'
import { useRouter } from 'next/router'

const Fullscreen = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
})

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

  const router = useRouter()
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (quoteCartId === undefined) return
    if (ssnValue.length !== 12) return
    await createQuoteBundle()
    await router.push(PageLink.cart({ quoteCartId }))
  }

  const handleCheckboxChange = () => {
    setIsCurrentAddress(!isCurrentAddress)
  }

  const quoteBundle = quoteBundleData?.quoteCart_createSwedishBundle
  const hasQuoteBundle = Boolean(quoteBundle) && quoteBundle?.__typename === 'QuoteCart'

  if (isLoadingQuoteBundle || hasQuoteBundle) {
    return ReactDOM.createPortal(
      <Fullscreen>
        <LoadingPage />
      </Fullscreen>,
      document.body,
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
          label="Personal number"
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
          labelText="I want a price quote for my current address"
        />
        <Button type="submit" onClick={handleSubmit} $hasFullWidth disabled={!isCurrentAddress}>
          Get the info - Give me a price
        </Button>
      </Space>
    </>
  )
}
