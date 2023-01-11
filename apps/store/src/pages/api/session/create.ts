import { ApolloClient } from '@apollo/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import {
  CartEntryAddDocument,
  CartEntryAddMutation,
  CartEntryAddMutationVariables,
} from '@/services/apollo/generated'
import { CountryCode } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  PriceIntentService,
  priceIntentServiceInitServerSide,
} from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const LOGGER = logger.child({ module: 'api/session/create' })
const TEST_SSN = '199808302393'
const productNames = ['SE_APARTMENT_RENT', 'SE_ACCIDENT'] as const

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

    const shopSession = await shopSessionService.create({ countryCode: CountryCode.Se })
    LOGGER.info(`Created new ShopSession: ${shopSession.id}`)

    const priceIntentService = priceIntentServiceInitServerSide({ apolloClient, req, res })

    const emailAddress = getRandomEmailAddress()
    const ssn = (req.query.ssn ?? TEST_SSN) as string
    const maskedSsn = ssn.replace(/(\d{4})$/, '****')
    LOGGER.info(`Using SSN: ${maskedSsn} and email: ${emailAddress}`)

    await Promise.all(
      productNames.map((productName) =>
        addProduct({
          ssn,
          emailAddress,
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
    LOGGER.error(error, 'Unable to create ShopSession with products')
  }

  const nextURL = new URL(ORIGIN_URL)
  nextURL.pathname = PageLink.cart({ locale: 'en-se' })
  const destination = nextURL.toString()
  LOGGER.info(`Re-directing to destination: ${destination}`)
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
  ssn: string
  emailAddress: string
  apolloClient: ApolloClient<unknown>
  cartId: string
}

const addProduct = async ({
  productName,
  priceIntentService,
  shopSessionId,
  ssn,
  emailAddress,
  apolloClient,
  cartId,
}: AddProductParams) => {
  LOGGER.info(`Adding product to cart: ${productName}`)
  const priceTemplate = fetchPriceTemplate(productName)
  if (!priceTemplate) {
    LOGGER.error({ productName }, 'Price template not found')
    throw new Error('Price template not found')
  }
  const priceIntent = await priceIntentService.create({
    shopSessionId: shopSessionId,
    productName,
    priceTemplate,
  })

  await priceIntentService.update({
    priceIntentId: priceIntent.id,
    data: {
      ssn: ssn,
      street: 'Testgatan 1',
      zipCode: '12345',
      livingSpace: 50,
      numberCoInsured: 0,
      email: emailAddress,
    },
  })

  const updatedPriceIntent = await priceIntentService.confirm(priceIntent.id)

  const results = await apolloClient.mutate<CartEntryAddMutation, CartEntryAddMutationVariables>({
    mutation: CartEntryAddDocument,
    variables: { cartId, offerId: updatedPriceIntent.offers[0].id },
  })
  if (!results.data?.cartEntriesAdd.cart) {
    LOGGER.error(
      {
        priceIntentId: priceIntent.id,
        cartId,
      },
      `Unable to add cart entry: ${productName}`,
    )
    throw new Error('Unable to add cart entry')
  }
}
