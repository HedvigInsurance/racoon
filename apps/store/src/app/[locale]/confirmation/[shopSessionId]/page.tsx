import { cookies } from 'next/headers'
import { fetchMemberPartnerData } from '@/app/[locale]/confirmation/[shopSessionId]/api/fetchMemberPartnerData'
import { fetchSwitchingData } from '@/app/[locale]/confirmation/[shopSessionId]/components/SwitchingAssistantSection/fetchSwitchingData'
import { ConfirmationPage } from '@/app/[locale]/confirmation/[shopSessionId]/ConfirmationPage'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { getAccessToken } from '@/services/authApi/app-router/persist'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type Params = { locale: RoutingLocale; shopSessionId: string }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const cookiesStore = cookies()
  const { getApolloClient } = setupApolloClient({ locale: params.locale, cookies: cookiesStore })
  const apolloClient = getApolloClient()
  const shopSessionService = setupShopSession(apolloClient)

  const accessToken = getAccessToken(cookiesStore)
  const [shopSession, switchingData, memberPartnerData, confirmationStory] = await Promise.all([
    shopSessionService.fetchById(params.shopSessionId),
    accessToken ? fetchSwitchingData(shopSessionService, params.shopSessionId) : null,
    accessToken ? fetchMemberPartnerData(apolloClient) : null,
    fetchConfirmationStory(params.locale),
  ])

  return (
    <ConfirmationPage
      story={confirmationStory}
      cart={shopSession.cart}
      switching={switchingData ?? undefined}
      memberPartnerData={memberPartnerData}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const story = await fetchConfirmationStory(params.locale)
  if (story) {
    return { title: story.content.seoTitle }
  }
}

async function fetchConfirmationStory(locale: RoutingLocale) {
  const CONFIRMATION_PAGE_SLUG = 'confirmation'

  try {
    const story = await getStoryBySlug<ConfirmationStory>(CONFIRMATION_PAGE_SLUG, { locale })
    return story
  } catch (error) {
    console.error('Confirmation page | error while retrieving confirmation story', error)
  }
}
