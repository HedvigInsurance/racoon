import { type GetServerSideProps } from 'next'
import NextCmsPage from '@/pages/[locale]/[[...slug]]'
import { getStoryblokPageProps } from '@/services/storyblok/getStoryblokPageProps'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

const LANDING_PAGE_SLUG = 'car-buyer'

type Props = Awaited<ReturnType<typeof getStoryblokPageProps>>

type Params = {
  contractId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  const { params, locale, draftMode = false } = context
  if (!params) throw new Error('Missing params')
  if (!isRoutingLocale(locale)) return { notFound: true }

  const props = await getStoryblokPageProps({
    context,
    slug: LANDING_PAGE_SLUG,
    locale,
    draftMode,
  })

  return {
    props,
  }
}

export default NextCmsPage
