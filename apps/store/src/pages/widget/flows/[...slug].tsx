import { GetServerSideProps } from 'next'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import { initializeApolloServerSide } from '@/services/apollo/client'
import {
  ShopSessionCreatePartnerDocument,
  ShopSessionCreatePartnerMutation,
  ShopSessionCreatePartnerMutationVariables,
} from '@/services/apollo/generated'
import { PageStory, WidgetFlowStory, getStoryBySlug } from '@/services/storyblok/storyblok'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Params = { slug: Array<string> }

export const getServerSideProps: GetServerSideProps<any, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${context.params.slug.join('/')}`

  const story = await getStoryBySlug<PageStory | WidgetFlowStory>(slug, {
    version: context.draftMode ? 'draft' : undefined,
    locale: context.locale,
  })
  const flow = String(story.id)

  if (!isWidgetFlowStory(story)) {
    console.warn('Story is not a widget flow story:', story.slug)
    return { notFound: true }
  }

  const apolloClient = await initializeApolloServerSide({ ...context, locale: context.locale })
  const { countryCode } = getCountryByLocale(context.locale)
  const result = await apolloClient.mutate<
    ShopSessionCreatePartnerMutation,
    ShopSessionCreatePartnerMutationVariables
  >({
    mutation: ShopSessionCreatePartnerDocument,
    variables: { input: { countryCode, partnerName: story.content.partner } },
  })

  const shopSessionId = result.data?.shopSessionCreatePartner.id
  if (!shopSessionId) throw new Error('Missing shopSessionId')

  return {
    redirect: {
      // TODO: Pass along any query params
      destination: PageLink.widgetSelectProduct({
        locale: context.locale,
        flow,
        shopSessionId,
      }).href,
      permanent: false,
    },
  }
}

const Page = () => null
export default Page
