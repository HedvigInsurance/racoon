import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { fetchConfirmationStory } from '@/components/ConfirmationPage/fetchConfirmationStory'
import { SuccessAnimation } from '@/components/ConfirmationPage/SuccessAnimation/SuccessAnimation'
import { ConfirmationPage } from '@/features/widget/ConfirmationPage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { hideChatOnPage } from '@/services/CustomerFirst'
import { useShopSessionQuery } from '@/services/graphql/generated'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { type WidgetFlowStory, getStoryById } from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = Omit<ComponentProps<typeof ConfirmationPage>, 'shopSession'> & {
  shopSessionId: string
}

type Params = {
  flow: string
  shopSessionId: string
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
  const [translations, story, confirmationStory] = await Promise.all([
    serverSideTranslations(context.locale),
    getStoryById<WidgetFlowStory>({
      id: context.params.flow,
      version: context.draftMode ? 'draft' : undefined,
    }),
    fetchConfirmationStory(context.locale),
    shopSessionService.fetchById(context.params.shopSessionId),
  ])

  return addApolloState(apolloClient, {
    props: {
      ...translations,
      ...context.params,
      ...hideChatOnPage(),
      title: confirmationStory.content.title,
      staticContent: confirmationStory.content,
      backToAppButton: story.content.backToAppButtonLabel,
    },
  })
}

const Page = (props: Props) => {
  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId: props.shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <SuccessAnimation>
        {shopSession && <ConfirmationPage {...props} shopSession={shopSession} />}
      </SuccessAnimation>
    </>
  )
}

export default Page
