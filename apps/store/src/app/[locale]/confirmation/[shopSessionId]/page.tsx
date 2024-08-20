import { type Metadata } from 'next'
import { cookies } from 'next/headers'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { fetchMemberPartnerData } from '@/components/ConfirmationPage/fetchMemberPartnerData'
import { fetchSwitchingData } from '@/components/ConfirmationPage/SwitchingAssistantSection/fetchSwitchingData'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { getAccessToken } from '@/services/authApi/app-router/persist'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type Params = { locale: RoutingLocale; shopSessionId: string }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const confirmationStory = await fetchConfirmationStory(params.locale)
  const cookiesStore = cookies()
  const { getApolloClient } = setupApolloClient({ locale: params.locale, cookies: cookiesStore })
  const apolloClient = getApolloClient()
  const shopSessionService = setupShopSession(apolloClient)

  const accessToken = getAccessToken(cookiesStore)
  const [shopSession, switchingData, memberPartnerData] = await Promise.all([
    shopSessionService.fetchById(params.shopSessionId),
    accessToken ? fetchSwitchingData(shopSessionService, params.shopSessionId) : null,
    accessToken ? fetchMemberPartnerData(apolloClient) : null,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await fetchConfirmationStory(params.locale)

  return { title: story.content.seoTitle }
}

function fetchConfirmationStory(locale: RoutingLocale): Promise<ConfirmationStory> {
  const CONFIRMATION_PAGE_SLUG = 'confirmation'

  return getStoryBySlug<ConfirmationStory>(CONFIRMATION_PAGE_SLUG, { locale })
}
