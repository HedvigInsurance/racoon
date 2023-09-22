import { type NextApiHandler } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { CountryCode } from '@/services/apollo/generated'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'

const PRODUCT_NAME_CAR = 'SE_CAR'

const handler: NextApiHandler = async (req, res) => {
  // Get ssn from request body
  const ssn = req.body.ssn as string

  // Create a shop session
  const apolloClient = await initializeApolloServerSide({ req, res, locale: 'se' })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })
  const shopSession = await shopSessionService.create({ countryCode: CountryCode.Se })

  const priceIntentService = priceIntentServiceInitServerSide({ req, res, apolloClient })

  const priceTemplate = fetchPriceTemplate(PRODUCT_NAME_CAR)
  if (!priceTemplate) {
    throw new Error(`Could not find price template for product ${PRODUCT_NAME_CAR}`)
  }

  const priceIntent = await priceIntentService.create({
    shopSessionId: shopSession.id,
    priceTemplate,
    productName: PRODUCT_NAME_CAR,
  })

  await priceIntentService.update({
    priceIntentId: priceIntent.id,
    data: {
      street: 'Testgatan 1',
      zipCode: '12345',
      registrationNumber: 'ABC001',
      mileage: 1500,
    },
    customer: {
      shopSessionId: shopSession.id,
      ssn,
      email: getRandomEmailAddress(),
    },
  })

  await priceIntentService.confirm(priceIntent.id)

  // res.redirect(302, `/se/car-trials/${shopSession.id}`)
  res.json({ shopSessioId: shopSession.id })
}

export default handler

const getRandomEmailAddress = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}
