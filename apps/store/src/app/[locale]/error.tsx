'use client' // Error components must be Client Components

import { useTranslation } from 'next-i18next'
import { useEffect } from 'react' // This is what we're getting from NextJs
import { Heading } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { errorWrapper } from './error.css'

// This is what we're getting from NextJs
type ErrorProps = { error: Error & { digest?: string }; reset: () => void }

export default function Error(props: ErrorProps) {
  const { t } = useTranslation()
  useEffect(() => {
    console.error('Error caught', props.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.error.digest])

  return (
    <div className={errorWrapper}>
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
