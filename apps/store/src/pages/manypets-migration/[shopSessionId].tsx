import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ManyPetsMigrationPage } from '@/components/ManyPetsMigrationPage/ManyPetsMigrationPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = { [SHOP_SESSION_PROP_NAME]: string }
type Params = { shopSessionId: string }

const NextManyPetsMigrationPage: NextPage<Props> = () => {
  return <ManyPetsMigrationPage />
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context

  if (!Features.enabled('MANYPETS_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return { notFound: true }
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })

  const [shopSession, translations] = await Promise.all([
    shopSessionService.fetchById(shopSessionId).catch((err) => {
      console.error('Failed to find shopSession', err)
    }),
    serverSideTranslations(locale),
  ])

  if (shopSession) {
    shopSessionService.saveId(shopSessionId)
  } else {
    return { notFound: true }
  }

  return addApolloState(apolloClient, {
    props: {
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      ...translations,
    },
  })
}

export default NextManyPetsMigrationPage
