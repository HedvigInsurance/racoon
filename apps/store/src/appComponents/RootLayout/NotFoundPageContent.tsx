'use client'
import { useTranslation } from 'next-i18next'
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ErrorPage } from '@/components/ErrorPage/ErrorPage'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export const NotFoundPageContent = () => {
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
