import { GetStaticProps, NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ErrorPage } from '@/components/ErrorPage/ErrorPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

const NextPage: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const locale = useRoutingLocale()

  return (
    <ErrorPage>
      <SpaceFlex direction="vertical" align="center" space={1.5}>
        <Heading as="h1" variant={{ _: 'standard.24', lg: 'standard.32' }}>
          {t('404_PAGE_MESSAGE')}
        </Heading>

        <ButtonNextLink
          variant="primary"
          size={{ base: 'small', lg: 'medium' }}
          href={PageLink.home({ locale }).pathname}
        >
          {t('404_PAGE_BUTTON')}
        </ButtonNextLink>
      </SpaceFlex>
    </ErrorPage>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  // Impossible to determine locale at build time anymore, so let's use default
  // To be fixed with app router 404 implementation
  const locale: RoutingLocale = getLocaleOrFallback(FALLBACK_LOCALE).routingLocale
  context.locale = locale

  const props = await getLayoutWithMenuProps(context)

  return { props }
}

NextPage.getLayout = (children) => <LayoutWithMenu overlayMenu={true}>{children}</LayoutWithMenu>

export default NextPage
