import { type Metadata } from 'next'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { fetchMemberPartnerData } from '@/components/ConfirmationPage/fetchMemberPartnerData'
import { SuccessAnimation } from '@/components/ConfirmationPage/SuccessAnimation/SuccessAnimation'
import { fetchSwitchingData } from '@/components/ConfirmationPage/SwitchingAssistantSection/fetchSwitchingData'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type Params = { locale: RoutingLocale; shopSessionId: string }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const confirmationStory = await fetchConfirmationStory(params.locale)

  const { getApolloClient } = setupApolloClient({ locale: params.locale })
  const apolloClient = getApolloClient()
  const shopSessionService = setupShopSession(apolloClient)
  const [shopSession, switchingData, memberPartnerData] = await Promise.all([
    shopSessionService.fetchById(params.shopSessionId),
    fetchSwitchingData(shopSessionService, params.shopSessionId),
    fetchMemberPartnerData(apolloClient),
  ])

  return (
    <SuccessAnimation>
      <ConfirmationPage
        story={confirmationStory}
        cart={shopSession.cart}
        switching={switchingData ?? undefined}
        memberPartnerData={memberPartnerData}
      />
    </SuccessAnimation>
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

// Make sure this route always gets generated using dynamic rendering.
// This provides a simple migration path between SSR pages into it's app router based counterpart.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#options
export const dynamic = 'force-dynamic'
