'use server'

import { redirect } from 'next/navigation'
import { addProduct, updateCustomer } from '@/pages/api/session/create'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { CountryCode } from '@/services/graphql/graphql'
import { setupPriceIntentService } from '@/services/priceIntent/app-router/PriceIntentService.utils'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

const DEFAULT_LOCALE: RoutingLocale = 'se-en'
const DEFAULT_COUNTRY_CODE = CountryCode.Se
const TEST_SSN = '199808302393'
const productNames = ['SE_APARTMENT_RENT', 'SE_ACCIDENT'] as const

const getRandomEmailAddress = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}

export const createCustomerSession = async (formData: FormData) => {
  try {
    const ssn = formData.get('ssn') || TEST_SSN

    if (typeof ssn !== 'string') {
      return
    }

    const apolloClient = getApolloClient({ locale: DEFAULT_LOCALE })

    const shopSessionService = setupShopSession(apolloClient)
    const shopSession = await shopSessionService.create({ countryCode: DEFAULT_COUNTRY_CODE })
    console.log(`Created new ShopSession: ${shopSession.id}`)

    const maskedSsn = ssn.replace(/(\d{4})$/, '****')
    const emailAddress = getRandomEmailAddress()
    console.log(`Using SSN: ${maskedSsn} and email: ${emailAddress}`)

    await updateCustomer({
      apolloClient,
      shopSessionId: shopSession.id,
      ssn,
      emailAddress,
    })

    const priceIntentService = setupPriceIntentService(apolloClient)

    await Promise.all(
      productNames.map((productName) =>
        addProduct({
          apolloClient,
          priceIntentService,
          productName,
          shopSessionId: shopSession.id,
        }),
      ),
    )

    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    throw new Error('Unable to create ShopSession with products', { cause: error })
  }

  const destination = PageLink.cart({ locale: DEFAULT_LOCALE }).href
  console.log(`Re-directing to destination: ${destination}`)

  redirect(destination)
}
