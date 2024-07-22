import { Suspense } from 'react'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import type { RoutingLocale } from '@/utils/l10n/types'
import { initTranslations } from '../../i18n'
import { ClientComponent } from './ClientComponent'
import { wrapper } from './styles.css'

type Props = {
  params: { locale: RoutingLocale }
}

const Page = async (props: Props) => {
  const { t } = await initTranslations(props.params.locale)
  // Same graphql request as in layout, only one network request gets executed thanks to Apollo SSR cache
  const { getApolloClient } = setupApolloClient({ locale: props.params.locale })
  const apolloClient = getApolloClient()
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })

  return (
    <div className={wrapper}>
      <h1>Server-side translation: {t('404_PAGE_MESSAGE')}</h1>
      <br />
      <h3>Available products</h3>
      <ul>
        {productMetadata.map((item) => (
          <li key={item.id}>- {item.displayNameFull}</li>
        ))}
      </ul>
      <br />
      <Suspense>
        <ClientComponent />
      </Suspense>
    </div>
  )
}
export default Page
