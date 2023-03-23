import { GetServerSideProps } from 'next'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const Page = () => {
  return null
}

export default Page

type Props = Record<string, unknown>
type Params = { code: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ locale, params }) => {
  if (!isRoutingLocale(locale)) return { notFound: true }

  const code = params?.code
  if (!code) return { notFound: true }

  return { redirect: { destination: PageLink.forever({ locale, code }), permanent: false } }
}
