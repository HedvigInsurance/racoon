import { ApolloClient } from '@apollo/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import {
  CartEntryAddDocument,
  CartEntryAddMutation,
  CartEntryAddMutationVariables,
  ShopSessionCustomerUpdateDocument,
  ShopSessionCustomerUpdateMutation,
  ShopSessionCustomerUpdateMutationVariables,
} from '@/services/apollo/generated'
import { CountryCode } from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  PriceIntentService,
  priceIntentServiceInitServerSide,
} from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const TEST_SSN = '199808302393'
const productNames = ['SE_APARTMENT_RENT', 'SE_ACCIDENT'] as const
// TODO: iternationalize
const DEFAULT_LOCALE = 'en-se'
const DEFAULT_COUNTRY_CODE = CountryCode.Se

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    resetAuthTokens({ req, res })

    const apolloClient = await initializeApolloServerSide({ req, res, locale: DEFAULT_LOCALE })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

    const shopSession = await shopSessionService.create({ countryCode: DEFAULT_COUNTRY_CODE })
    console.log(`Created new ShopSession: ${shopSession.id}`)

    const ssn = (req.query.ssn ?? TEST_SSN) as string
    const maskedSsn = ssn.replace(/(\d{4})$/, '****')
    const emailAddress = getRandomEmailAddress()
    console.log(`Using SSN: ${maskedSsn} and email: ${emailAddress}`)
    await updateCustomer({
      apolloClient,
      shopSessionId: shopSession.id,
      ssn,
      emailAddress,
    })

    const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })

    await Promise.all(
      productNames.map((productName) =>
        addProduct({
          apolloClient,
          priceIntentService,
          productName,
          shopSessionId: shopSession.id,
          cartId: shopSession.cart.id,
        }),
      ),
    )

    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    throw new Error('Unable to create ShopSession with products', { cause: error })
  }

  const nextURL = new URL(ORIGIN_URL)
  nextURL.pathname = PageLink.cart({ locale: DEFAULT_LOCALE })
  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  return res.redirect(destination)
}

export default handler

const getRandomEmailAddress = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}

type AddProductParams = {
  productName: string
  priceIntentService: PriceIntentService
  shopSessionId: string
  apolloClient: ApolloClient<unknown>
  cartId: string
}

const addProduct = async ({
  productName,
  priceIntentService,
  shopSessionId,
  apolloClient,
  cartId,
}: AddProductParams) => {
  console.log(`Adding product to cart: ${productName}`)
  const priceTemplate = fetchPriceTemplate(productName)
  if (!priceTemplate) {
    throw new Error(`Price template not found: ${productName}`)
  }
  const priceIntent = await priceIntentService.create({
    shopSessionId: shopSessionId,
    productName,
    priceTemplate,
  })

  await priceIntentService.update({
    priceIntentId: priceIntent.id,
    data: {
      street: 'Testgatan 1',
      zipCode: '12345',
      livingSpace: 50,
      numberCoInsured: 0,
    },
    customer: { shopSessionId },
  })

  const updatedPriceIntent = await priceIntentService.confirm(priceIntent.id)

  const results = await apolloClient.mutate<CartEntryAddMutation, CartEntryAddMutationVariables>({
    mutation: CartEntryAddDocument,
    variables: { cartId, offerId: updatedPriceIntent.offers[0].id },
  })
  if (!results.data?.cartEntriesAdd.cart) {
    throw new Error(
      `Unable to add cart entry, ${JSON.stringify({
        priceIntentId: priceIntent.id,
        cartId,
        productName,
      })}`,
    )
  }
}

type UpdateCustomerParams = {
  shopSessionId: string
  ssn: string
  emailAddress: string
  apolloClient: ApolloClient<unknown>
}

const updateCustomer = async ({
  apolloClient,
  shopSessionId,
  ssn,
  emailAddress,
}: UpdateCustomerParams) => {
  const result = await apolloClient.mutate<
    ShopSessionCustomerUpdateMutation,
    ShopSessionCustomerUpdateMutationVariables
  >({
    mutation: ShopSessionCustomerUpdateDocument,
    variables: {
      input: { shopSessionId, ssn, email: emailAddress },
    },
  })

  if (!result.data?.shopSessionCustomerUpdate.shopSession) {
    throw new Error(
      `Unable to update customer, ${JSON.stringify({ shopSessionId, ssn, emailAddress })}`,
    )
  }
}
