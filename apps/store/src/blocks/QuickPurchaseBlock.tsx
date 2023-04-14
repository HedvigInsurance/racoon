import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useCallback, type FormEventHandler, useMemo } from 'react'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  QuickPurchaseForm,
  SSN_FIELDNAME,
  PRODUCT_FIELDNAME,
} from '@/components/QuickPurchaseForm/QuickPurchaseForm'
import {
  useProductMetadataQuery,
  useShopSessionCustomerUpdateMutation,
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
}>

export const QuickPurchaseBlock = ({ blok }: QuickPurchaseBlockProps) => {
  const router = useRouter()
  const { shopSession } = useShopSession()
  const [updateCustomer] = useShopSessionCustomerUpdateMutation()
  const { data } = useProductMetadataQuery()

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

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()

      const shopSessionId = shopSession?.id
      if (shopSessionId == null) {
        throw new Error('[QuickPurchaseBlock]: could not found shop session id')
      }

      const formData = new FormData(event.currentTarget)
      const formState = Object.fromEntries(formData.entries())
      const { [SSN_FIELDNAME]: ssn, [PRODUCT_FIELDNAME]: productName } = formState

      if (typeof ssn !== 'string' || typeof productName !== 'string') {
        return datadogLogs.logger.error('[QuickPurchaseBlock]: ssn and product are required')
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
        return datadogLogs.logger.error('[QuickPurchaseBlock]: Failed while updating customer', {
          errors,
        })
      }

      const link = productOptions.find((product) => product.value === productName)?.pageLink
      if (link == null) {
        return datadogLogs.logger.error(
          `[QuickPurchaseBlock]: Could not found pageLink for product ${productName}`,
        )
      }

      const searchParams = new URLSearchParams(window.location.search)
      searchParams.append(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
      router.push({
        pathname: link,
        search: searchParams.toString(),
      })
    },
    [shopSession?.id, updateCustomer, productOptions, router],
  )

  return <QuickPurchaseForm productOptions={productOptions} onSubmit={handleSubmit} />
}
QuickPurchaseBlock.blockName = 'quickPurchase'
