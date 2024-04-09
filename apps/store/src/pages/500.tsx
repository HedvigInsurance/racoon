import type { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { errorPageWrapper } from '../components/errorPage.css'

const NextPage: NextPageWithLayout = () => {
  const { t } = useTranslation()

  return (
    <div className={errorPageWrapper}>
      <Heading as="h1" variant={{ _: 'standard.24', lg: 'standard.32' }}>
        {t('500_PAGE_MESSAGE')}
      </Heading>

      <ButtonNextLink
        variant="primary"
        size={{ base: 'small', lg: 'medium' }}
        href={PageLink.home({ locale: toRoutingLocale(FALLBACK_LOCALE) }).pathname}
      >
        {t('500_PAGE_BUTTON')}
      </ButtonNextLink>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  context.locale = toRoutingLocale(FALLBACK_LOCALE)
  const props = await getLayoutWithMenuProps(context)
  return { props }
}

export default NextPage
