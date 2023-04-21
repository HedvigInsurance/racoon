import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState, useMemo, type FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { ConditionalWrapper, theme } from 'ui'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  QuickPurchaseForm,
  ProductOption,
  FormError,
  SSN_FIELDNAME,
  PRODUCT_FIELDNAME,
} from '@/components/QuickPurchaseForm/QuickPurchaseForm'
import {
  useProductMetadataQuery,
  useRedeemCampaignMutation,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  showSsnField: boolean
  campaignCode?: string
}>

export const QuickPurchaseBlock = ({ blok, nested }: QuickPurchaseBlockProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormError>()

  const router = useRouter()
  const { t } = useTranslation()

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
      setError({})
      setIsSubmitting(true)

      if (!shopSession) {
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
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
        setError((prevState) => ({ ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }))
        throw new Error(`[QuickPurchaseBlock]: Could not found pageLink for product ${productName}`)
      }

      // TODO: Maybe notify users that their cart will be cleared if they use this block with a
      // different ssn of the one already attached to the shop session
      if (shopSession.customer && shopSession.customer.ssn !== ssn) {
        await resetShopSession()
        resetAuthTokens()
        datadogLogs.logger.info('[QuickPurchaseBlock]: Cleared shopSession to change SSN')
      }

      await updateCustomer({
        variables: {
          input: {
            shopSessionId: shopSession.id,
            ssn,
          },
        },
        onError(error) {
          const message = error.extraInfo?.userError?.message
          setError((prevState) => {
            if (message) {
              return { ...prevState, ssn: message }
            }
            return { ...prevState, general: t('UNKNOWN_ERROR_MESSAGE') }
          })
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
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <QuickPurchaseForm
        productOptions={productOptions}
        onSubmit={handleSubmit}
        loading={loadingProductMetadata || isSubmitting}
        showSsnField={blok.showSsnField}
        ssnDefaultValue={shopSession?.customer?.ssn ?? ''}
        error={error}
      />
    </ConditionalWrapper>
  )
}
QuickPurchaseBlock.blockName = 'quickPurchase'

const Wrapper = styled.div({
  width: 'min(25rem, 100%)',
  margin: '0 auto',
  paddingInline: theme.space.md,
})
