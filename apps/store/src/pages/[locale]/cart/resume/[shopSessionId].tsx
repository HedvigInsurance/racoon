import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { type GetServerSideProps, type NextPageWithLayout } from 'next'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import type { PageStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = {
  story: PageStory
}

type Params = {
  shopSessionId: string
}

const NextPage: NextPageWithLayout<Props> = (props) => {
  const story = useStoryblokState(props.story)
  if (!story) return null

  return (
    <>
      <HeadSeoInfo story={story} />
      <StoryblokComponent blok={story.content} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  if (!context.params) throw new Error('No params in context')
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  try {
    const shopSessionId = context.params.shopSessionId

    const apolloClient = await initializeApolloServerSide({
      req: context.req,
      res: context.res,
      locale: context.locale,
    })

    const shopSessionService = setupShopSessionServiceServerSide({
      apolloClient,
      req: context.req,
      res: context.res,
    })

    shopSessionService.saveId(shopSessionId)

    const slug = 'cart/resume'
    const [story, layoutWithMenuProps] = await Promise.all([
      getStoryBySlug<PageStory>(slug, {
        locale: context.locale,
        ...(context.draftMode && { version: 'draft' }),
      }),
      getLayoutWithMenuProps(context, apolloClient),
    ])

    return addApolloState(apolloClient, {
      props: {
        ...layoutWithMenuProps,
        story,
        [SHOP_SESSION_PROP_NAME]: shopSessionId,
      },
    })
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
