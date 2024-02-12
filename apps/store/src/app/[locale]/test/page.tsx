import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from '../i18n'
import { ClientComponent } from './ClientComponent'
import { wrapper } from './styles.css'

type LocalizedPageProps<P = unknown> = P & {
  params: { locale: RoutingLocale }
}

const Page = async (props: LocalizedPageProps) => {
  const { t } = await initTranslationsServerSide(props.params.locale)
  return (
    <div className={wrapper}>
      <h1>Server-side translation: {t('404_PAGE_MESSAGE')}</h1>
      <br />
      <ClientComponent />
    </div>
  )
}
export default Page
