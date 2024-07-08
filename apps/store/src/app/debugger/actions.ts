'use server'

import type { ApolloClient } from '@apollo/client'
import { redirect } from 'next/navigation'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import type {
  CartEntryAddMutation,
  CartEntryAddMutationVariables,
  ShopSessionCustomerUpdateMutation,
  ShopSessionCustomerUpdateMutationVariables,
} from '@/services/graphql/generated'
import {
  CartEntryAddDocument,
  ShopSessionCustomerUpdateDocument,
} from '@/services/graphql/generated'
import { CountryCode } from '@/services/graphql/graphql'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { setupPriceIntentService } from '@/services/priceIntent/app-router/PriceIntentService.utils'
import type { PriceIntentService } from '@/services/priceIntent/PriceIntentService'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import type { FormStateWithErrors } from '../types/formStateTypes'

const DEFAULT_LOCALE: RoutingLocale = 'se-en'
const DEFAULT_COUNTRY_CODE = CountryCode.Se
const productNames = ['SE_APARTMENT_RENT', 'SE_ACCIDENT'] as const

const getRandomEmailAddress = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}

export const createCustomerSession = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  try {
    const ssn = formData.get('ssn')

    if (!ssn || typeof ssn !== 'string') {
      return {
        errors: {
          fields: {
            ssn: 'Valid SSN is required.',
          },
        },
      }
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

type AddProductParams = {
  productName: string
  priceIntentService: PriceIntentService
  shopSessionId: string
  apolloClient: ApolloClient<unknown>
}

const addProduct = async ({
  productName,
  priceIntentService,
  shopSessionId,
  apolloClient,
}: AddProductParams) => {
  console.log(`Adding product to cart: ${productName}`)
  const priceTemplate = getPriceTemplate(productName)
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
    variables: { shopSessionId, offerId: updatedPriceIntent.offers[0].id },
  })
  if (!results.data?.shopSessionCartEntriesAdd.shopSession) {
    throw new Error(
      `Unable to add cart entry, ${JSON.stringify({
        priceIntentId: priceIntent.id,
        shopSessionId,
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
