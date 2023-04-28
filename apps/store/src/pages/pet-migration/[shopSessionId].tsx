import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { PetMigrationPage } from '@/components/PetMigrationPage/PetMigrationPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { Flags } from '@/services/Flags/Flags'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = { [SHOP_SESSION_PROP_NAME]: string }
type Params = { shopSessionId: string }

const NextPetMigrationPage: NextPage<Props> = (props: Props) => {
  return <PetMigrationPage {...props} />
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context

  if (!Flags.getFeature('PET_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) {
    console.error('No shop session in URL')
    return { notFound: true }
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession
  try {
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    shopSession = await shopSessionService.fetchById(shopSessionId)
    shopSessionService.saveId(shopSession.id)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return { notFound: true }
  }

  return addApolloState(apolloClient, {
    props: {
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
    },
  })
}

export default NextPetMigrationPage
