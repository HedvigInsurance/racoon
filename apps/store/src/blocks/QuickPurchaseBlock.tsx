import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState, useMemo, type FormEventHandler } from 'react'
import { theme } from 'ui'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  QuickPurchaseForm,
  ProductOption,
  SSN_FIELDNAME,
  PRODUCT_FIELDNAME,
} from '@/components/QuickPurchaseForm/QuickPurchaseForm'
import {
  useProductMetadataQuery,
  useRedeemCampaignMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  campaignCode?: string
}>

export const QuickPurchaseBlock = ({ blok }: QuickPurchaseBlockProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { shopSession, reset: resetShopSession } = useShopSession()
  const { data, loading: loadingProductMetadata } = useProductMetadataQuery()

  const [updateCustomer] = useShopSessionCustomerUpdateMutation()
  const [redeemCampaign] = useRedeemCampaignMutation()

  const availableProducts = useMemo(() => data?.availableProducts ?? [], [data?.availableProducts])
  const productOptions = useMemo(() => {
    const result: Array<ProductOption & { pageLink: string }> = []
    blok.products.forEach((productName) => {
      const matchedProduct = availableProducts.find((product) => product.name === productName)
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
  }, [blok.products, availableProducts])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      if (!shopSession) {
        throw new Error('[QuickPurchaseBlock]: could not found shop session')
      }

      const formData = new FormData(event.currentTarget)
      const formState = Object.fromEntries(formData.entries())
      const { [SSN_FIELDNAME]: ssn, [PRODUCT_FIELDNAME]: productName } = formState

      // This should never happen since QuickPurchaseForm conrols are required
      if (typeof ssn !== 'string' || typeof productName !== 'string') {
        throw new Error('[QuickPurchaseBlock]: ssn and product are required')
      }

      const pageLink = productOptions.find((product) => product.value === productName)?.pageLink
      if (pageLink === undefined) {
        throw new Error(`[QuickPurchaseBlock]: Could not found pageLink for product ${productName}`)
      }

      // TODO: Maybe notify users that their cart will be cleared if they use this block with a
      // different ssn of the one already attached to the shop session
      if (shopSession.customer && shopSession.customer.ssn !== ssn) {
        await resetShopSession()
      }

      await updateCustomer({
        variables: {
          input: {
            shopSessionId: shopSession.id,
            ssn,
          },
        },
        onError(error) {
          throw new Error(`[QuickPurchaseBlock]: Failed while updating customer: ${error.message}`)
        },
      })

      if (blok.campaignCode) {
        await redeemCampaign({
          variables: {
            cartId: shopSession.cart.id,
            code: blok.campaignCode,
          },
          onError(error) {
            datadogLogs.logger.error(
              `[QuickPurchaseBlock]: Failed while redeeming campaign code ${blok.campaignCode}: ${error.message}`,
            )
          },
        })
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
