'use client'
import { useTranslation } from 'next-i18next'
import { Heading } from 'ui/src/components/Heading/Heading'
import { yStack } from 'ui/src/patterns'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ErrorPage } from '@/components/ErrorPage/ErrorPage'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export const NotFoundPageContent = () => {
  const { t } = useTranslation('common')
  const locale = useRoutingLocale()
  return (
    <ErrorPage>
      <div className={yStack({ alignItems: 'center', gap: 'lg' })}>
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
      </div>
    </ErrorPage>
  )
}
