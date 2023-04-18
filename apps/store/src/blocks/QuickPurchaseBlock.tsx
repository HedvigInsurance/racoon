import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect, useRef, type FormEventHandler } from 'react'
import { theme } from 'ui'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  QuickPurchaseForm,
  SSN_FIELDNAME,
  PRODUCT_FIELDNAME,
} from '@/components/QuickPurchaseForm/QuickPurchaseForm'
import {
  useProductMetadataQuery,
  useRedeemCampaignMutation,
  useShopSessionCustomerUpdateMutation,
  useUnredeemCampaignMutation,
} from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductOption = {
  name: string
  value: string
  pageLink: string
}

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  campaignCode?: string
}>

export const QuickPurchaseBlock = ({ blok }: QuickPurchaseBlockProps) => {
  const previousRedeemedCampaignCodeId = useRef<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { shopSession, reset: resetShopSession } = useShopSession()
  const { data, loading: loadingProductMetadata } = useProductMetadataQuery()

  const [updateCustomer] = useShopSessionCustomerUpdateMutation()
  const [redeemCampaign] = useRedeemCampaignMutation()
  const [unredeemCampaign] = useUnredeemCampaignMutation()

  useEffect(() => {
    if (!shopSession?.cart.id) return

    if (blok.campaignCode) {
      redeemCampaign({
        variables: {
          cartId: shopSession.cart.id,
          code: blok.campaignCode,
        },
        onCompleted(data) {
          previousRedeemedCampaignCodeId.current =
            data.cartRedeemCampaign.cart?.redeemedCampaigns[0].id ?? null
        },
        onError(error) {
          const errorMessage = `Unable to redeem campaing code ${blok.campaignCode}: ${error.message}`
          console.error(errorMessage)

          // Notify editors
          if (process.env.NODE_ENV === 'development') {
            alert(errorMessage)
          }
        },
      })
    } else {
      const hasRedeemedCampaign =
        previousRedeemedCampaignCodeId.current &&
        shopSession.cart.redeemedCampaigns.some(
          ({ id }) => id === previousRedeemedCampaignCodeId.current,
        )

      if (hasRedeemedCampaign) {
        unredeemCampaign({
          variables: {
            cartId: shopSession.cart.id,
            campaignId: previousRedeemedCampaignCodeId.current!,
          },
          onCompleted() {
            previousRedeemedCampaignCodeId.current = null
          },
          onError(error) {
            const errorMessage = `Unable to unredeem campaing code of id ${previousRedeemedCampaignCodeId.current}: ${error.message}`
            console.error(errorMessage)

            // Notify editors
            if (process.env.NODE_ENV === 'development') {
              alert(errorMessage)
            }
          },
        })
      }
    }
  }, [
    redeemCampaign,
    unredeemCampaign,
    shopSession?.cart.id,
    shopSession?.cart.redeemedCampaigns,
    blok.campaignCode,
  ])

  const availableProducts = useMemo(() => data?.availableProducts ?? [], [data?.availableProducts])
  const productOptions = useMemo(() => {
    const result: Array<ProductOption> = []
    blok.products.forEach((productName) => {
      const matchedProduct = availableProducts.find((product) => product.name === productName)
      if (matchedProduct) {
        result.push({
          name: matchedProduct.displayNameShort,
          value: matchedProduct.name,
          pageLink: matchedProduct.pageLink,
        })
      }
    })

    return result
  }, [blok.products, availableProducts])
  // By design, only one campaign code can be configured by the CMS
  const redeemedCampaignCode = shopSession?.cart.redeemedCampaigns[0]

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      const formData = new FormData(event.currentTarget)
      const formState = Object.fromEntries(formData.entries())
      const { [SSN_FIELDNAME]: ssn, [PRODUCT_FIELDNAME]: productName } = formState

      if (typeof ssn !== 'string' || typeof productName !== 'string') {
        throw new Error('[QuickPurchaseBlock]: ssn and product are required')
      }

      if (shopSession?.customer?.ssn && shopSession.customer.ssn !== ssn) {
        await resetShopSession()
      }

      const shopSessionId = shopSession?.id
      if (shopSessionId == null) {
        throw new Error('[QuickPurchaseBlock]: could not found shop session id')
      }

      const { errors } = await updateCustomer({
        variables: {
          input: {
            shopSessionId,
            ssn,
          },
        },
      })

      if (errors) {
        throw new Error(`[QuickPurchaseBlock]: Failed while updating customer - ${errors}`)
      }

      const pageLink = productOptions.find((product) => product.value === productName)?.pageLink
      if (pageLink == null) {
        throw new Error(`[QuickPurchaseBlock]: Could not found pageLink for product ${productName}`)
      }

      const url = new URL(pageLink, window.location.origin)
      url.searchParams.append(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
      router.push(url.toString())
    } catch (error) {
      setIsSubmitting(false)
      datadogLogs.logger.error((error as Error).message)
    }
  }

  return (
    <Wrapper>
      <QuickPurchaseForm
        productOptions={productOptions}
        onSubmit={handleSubmit}
        loading={loadingProductMetadata || isSubmitting}
        ssnDefaultValue={shopSession?.customer?.ssn ?? ''}
        redeemedCampaign={redeemedCampaignCode}
      />
    </Wrapper>
  )
}
QuickPurchaseBlock.blockName = 'quickPurchase'

const Wrapper = styled.div({
  width: 'min(25rem, 100%)',
  margin: '0 auto',
  paddingInline: theme.space.md,
})
