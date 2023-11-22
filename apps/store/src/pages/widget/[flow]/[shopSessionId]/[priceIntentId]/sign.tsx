import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ComponentPropsWithoutRef } from 'react'
import { fetchSignPageContent } from '@/features/widget/fetchSignPageContent'
import { SignPage } from '@/features/widget/SignPage'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { useShopSessionQuery } from '@/services/apollo/generated'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = Omit<ComponentPropsWithoutRef<typeof SignPage>, 'shopSession'> & {
  shopSessionId: string
}

const NextWidgetSignPage = (props: Props) => {
  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId: props.shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  if (!shopSession) return null

  return <SignPage shopSession={shopSession} {...props} />
}

type Params = {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const apolloClient = await initializeApolloServerSide({
    req: context.req,
    res: context.res,
    locale: context.locale,
  })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })
  const priceIntentService = priceIntentServiceInitServerSide({
    apolloClient,
    req: context.req,
    res: context.res,
  })

  try {
    const [translations, shopSession, signPageContent, priceIntent] = await Promise.all([
      serverSideTranslations(context.locale),
      shopSessionService.fetchById(context.params.shopSessionId),
      fetchSignPageContent({
        flow: context.params.flow,
        locale: context.locale,
        draft: context.draftMode,
      }),
      priceIntentService.get(context.params.priceIntentId),
    ])

    const customer = shopSession.customer
    if (!customer) {
      throw new Error(`No customer in shop session ${shopSession.id}`)
    }

    if (!customer.ssn) {
      throw new Error(`No SSN in shop session ${shopSession.id}`)
    }

    if (!priceIntent) {
      throw new Error(`No price intent ${context.params.priceIntentId}`)
    }

    return {
      props: {
        ...translations,
        ssn: customer.ssn,
        shouldCollectEmail: getShouldCollectEmail(customer),
        shouldCollectName: getShouldCollectName(customer),
        customerAuthenticationStatus: customer.authenticationStatus,
        ...(customer.email && { suggestedEmail: customer.email }),
        shopSessionId: context.params.shopSessionId,
        content: signPageContent,
        flow: context.params.flow,
        priceIntentId: priceIntent.id,
        // TODO: check if we want to control this via CMS
        hideChat: true,
        productName: priceIntent.product.name,
      },
    }
  } catch (error) {
    console.error('Widget Checkout | Unable to render', error)
    return { notFound: true }
  }
}

export default NextWidgetSignPage
