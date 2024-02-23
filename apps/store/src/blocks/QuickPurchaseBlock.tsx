import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, useMemo, useState } from 'react'
import { theme } from 'ui'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  FormError,
  PRODUCT_FIELDNAME,
  ProductOption,
  QuickPurchaseForm,
  SSN_FIELDNAME,
} from '@/components/QuickPurchaseForm/QuickPurchaseForm'
import {
  useRedeemCampaignMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/graphql/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  showSsnField: boolean
  campaignCode?: string
  attributedTo?: string
}>

export const QuickPurchaseBlock = ({ blok, nested }: QuickPurchaseBlockProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormError>()

  const router = useRouter()
  const { t } = useTranslation()

  const apolloClient = useApolloClient()
  const { countryCode } = useCurrentCountry()
  const { shopSession: currentShopSession } = useShopSession()
  const productMetadata = useProductMetadata()

  const [updateCustomer] = useShopSessionCustomerUpdateMutation()
  const [redeemCampaign] = useRedeemCampaignMutation()

  const productOptions = useMemo(() => {
    const result: Array<ProductOption & { pageLink: string }> = []
    blok.products.forEach((productName) => {
      const matchedProduct = productMetadata?.find((product) => product.name === productName)
      if (matchedProduct) {
        result.push({
          name: matchedProduct.displayNameShort,
          value: matchedProduct.name,
          img: {
            src: matchedProduct.pillowImage.src,
            alt: matchedProduct.pillowImage.alt ?? '',
          },
          pageLink: matchedProduct.pageLink,
        })
      }
    })

    return result
  }, [blok.products, productMetadata])

  if (productOptions.length === 0) {
    throw new Error('QuickPurchaseBlock | no product options found')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setError({})
      setIsSubmitting(true)

      const formData = new FormData(event.currentTarget)
      const ssn = formData.get(SSN_FIELDNAME)
      const productName = formData.get(PRODUCT_FIELDNAME)

      // This should never happen since QuickPurchaseForm controls are required
      if (typeof ssn !== 'string' || typeof productName !== 'string') {
        throw new Error('QuickPurchaseBlock | ssn and product are required')
      }

      let shopSession = currentShopSession
      if (blok.attributedTo) {
        // Partner attribution can influence pricing, so we need to create a new shop session
        datadogLogs.setGlobalContextProperty('attributedTo', blok.attributedTo)
        datadogLogs.logger.info(
          `QuickPurchaseBlock | create shop session attributed to ${blok.attributedTo}`,
        )
        const shopSessionService = setupShopSessionServiceClientSide(apolloClient)
        shopSession = await shopSessionService.create({
          countryCode,
          attributedTo: blok.attributedTo,
        })
        shopSessionService.saveId(shopSession.id)
      }

      if (!shopSession) {
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
        throw new Error('QuickPurchaseBlock | shop session not found')
      }

      const pageLink = productOptions.find((product) => product.value === productName)?.pageLink
      if (pageLink === undefined) {
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
        throw new Error(`QuickPurchaseBlock | PDP link for ${productName} not found`)
      }

      // Pre-fetches PDP page - instant transitions
      router.prefetch(pageLink)

      if (ssn && ssn !== shopSession.customer?.ssn) {
        await updateCustomer({
          variables: {
            input: {
              shopSessionId: shopSession.id,
              ssn,
            },
          },
          onError(error) {
            const message = error.extraInfo?.userError?.message
            // TODO: use useAppErrorHandleContext or not even throw an error here.
            // It would be probably fine to redirect users even if we failed on updating
            // their ssn.
            setError((prevState) => {
              if (message) {
                return { ...prevState, ssn: message }
              }
              return { ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }
            })
            throw new Error(`QuickPurchaseBlock | failed to update customer: ${error.message}`)
          },
        })
      }

      if (blok.campaignCode) {
        redeemCampaign({
          variables: {
            shopSessionId: shopSession.id,
            code: blok.campaignCode,
          },
          onError(error) {
            datadogLogs.logger.error(
              `QuickPurchaseBlock | failed to redeem code ${blok.campaignCode}: ${error.message}`,
            )
          },
        })
      }

      const url = new URL(pageLink, window.location.origin)
      url.searchParams.append(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')

      if (shopSession.id !== currentShopSession?.id) {
        // Opt out of client side nav to make sure we use the latest shop session
        window.location.assign(url.toString())
      } else {
        router.push(url.toString())
      }
    } catch (error) {
      setIsSubmitting(false)
      datadogLogs.logger.error((error as Error).message)
    }
  }

  return (
    <Wrapper data-nested={nested}>
      <form onSubmit={handleSubmit}>
        <QuickPurchaseForm
          productOptions={productOptions}
          submitting={isSubmitting}
          showSsnField={blok.showSsnField}
          ssnDefaultValue={currentShopSession?.customer?.ssn ?? ''}
          error={error}
        />
      </form>
    </Wrapper>
  )
}
QuickPurchaseBlock.blockName = 'quickPurchase'

const Wrapper = styled.div({
  width: 'min(24rem, 100%)',
  marginInline: 'auto',
  '&[data-nested=false]': {
    paddingInline: theme.space.md,
  },
})
