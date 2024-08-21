'use client'
import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, useMemo, useState } from 'react'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import type {
  FormError,
  ProductOption,
} from '@/components/QuickPurchase/QuickPurchaseForm/QuickPurchaseForm'
import {
  PRODUCT_FIELDNAME,
  QuickPurchaseForm,
  SSN_FIELDNAME,
} from '@/components/QuickPurchaseV2/QuickPurchaseForm/QuickPurchaseForm'
import {
  useRedeemCampaignMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/graphql/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { wrapper } from './QuickPurchase.css'

type QuickPurchaseProps = {
  products: Array<string>
  preSelectFirstProduct?: boolean
  showSsnField: boolean
  campaignCode?: string
  attributedTo?: string
  nested?: boolean
}

export const QuickPurchaseV2 = (props: QuickPurchaseProps) => {
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
    const result: Array<
      ProductOption & { pageLink: string; priceCalculatorPageLink?: string | null }
    > = []
    props.products.forEach((productName) => {
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
          priceCalculatorPageLink: matchedProduct.priceCalculatorPageLink,
        })
      }
    })

    return result
  }, [props.products, productMetadata])

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
      if (props.attributedTo) {
        // Partner attribution can influence pricing, so we need to create a new shop session
        datadogLogs.setGlobalContextProperty('attributedTo', props.attributedTo)
        datadogLogs.logger.info(
          `QuickPurchaseBlock | create shop session attributed to ${props.attributedTo}`,
        )
        const shopSessionService = setupShopSessionServiceClientSide(apolloClient)
        shopSession = await shopSessionService.create({
          countryCode,
          attributedTo: props.attributedTo,
        })
        shopSessionService.saveId(shopSession.id)
      }

      if (!shopSession) {
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
        throw new Error('QuickPurchaseBlock | shop session not found')
      }

      const priceCalculatorPageLink = productOptions.find(
        (product) => product.value === productName,
      )?.priceCalculatorPageLink
      if (priceCalculatorPageLink == null) {
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
        throw new Error(`QuickPurchaseBlock | PDP link for ${productName} not found`)
      }

      // Pre-fetches Price Calculator page - instant transitions
      router.prefetch(priceCalculatorPageLink)

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

      if (props.campaignCode) {
        redeemCampaign({
          variables: {
            shopSessionId: shopSession.id,
            code: props.campaignCode,
          },
          onError(error) {
            datadogLogs.logger.error(
              `QuickPurchaseBlock | failed to redeem code ${props.campaignCode}: ${error.message}`,
            )
          },
        })
      }

      const url = new URL(priceCalculatorPageLink, window.location.origin)

      router.push(url.toString())
    } catch (error) {
      setIsSubmitting(false)
      datadogLogs.logger.error((error as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-nested={props.nested} className={wrapper}>
      <QuickPurchaseForm
        productOptions={productOptions}
        defaultValue={props.preSelectFirstProduct ? productOptions[0].value : undefined}
        submitting={isSubmitting}
        showSsnField={props.showSsnField}
        ssnDefaultValue={currentShopSession?.customer?.ssn ?? ''}
        error={error}
      />
    </form>
  )
}
