import { Suspense } from 'react'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { getClient } from '@/services/apollo/app-router/rscClient'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from '../i18n'
import { ClientComponent } from './ClientComponent'
import { wrapper } from './styles.css'

type LocalizedPageProps<P = unknown> = P & {
  params: { locale: RoutingLocale }
}

const Page = async (props: LocalizedPageProps) => {
  const { t } = await initTranslationsServerSide(props.params.locale)
  // Same graphql request as in layout, only one network request gets executed thanks to Apollo SSR cache
  const apolloClient = getClient({ locale: props.params.locale })
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })

  console.log('productMetadata@page, items:', productMetadata.length)
  return (
    <div className={wrapper}>
      <h1>Server-side translation: {t('404_PAGE_MESSAGE')}</h1>
      <br />
      <Suspense>
        <ClientComponent />
      </Suspense>
    </div>
  )
}
export default Page
