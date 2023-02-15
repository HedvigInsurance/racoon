import { NextPageWithLayout } from 'next'
import { useTranslation } from 'next-i18next'
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ErrorPage } from '@/components/ErrorPage/ErrorPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { PageLink } from '@/utils/PageLink'

const NextPage: NextPageWithLayout = () => {
  const { t } = useTranslation()

  return (
    <ErrorPage>
      <SpaceFlex direction="vertical" align="center" space={1.5}>
        <Heading as="h1" variant={{ _: 'standard.24', lg: 'standard.32' }}>
          {t('500_PAGE_MESSAGE')}
        </Heading>

        <ButtonNextLink
          variant="primary"
          size={{ base: 'small', lg: 'medium' }}
          href={PageLink.home()}
        >
          {t('500_PAGE_BUTTON')}
        </ButtonNextLink>
      </SpaceFlex>
    </ErrorPage>
  )
}

export { getStaticProps } from '@/pages/404'

NextPage.getLayout = (children) => <LayoutWithMenu overlayMenu={true}>{children}</LayoutWithMenu>

export default NextPage
