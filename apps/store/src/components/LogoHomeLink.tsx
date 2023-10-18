import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { HedvigLogo } from 'ui'
import { PageLink } from '@/utils/PageLink'

export const LogoHomeLink = () => {
  const { t } = useTranslation('common')

  return (
    <LogoLink href={PageLink.home().pathname} aria-label={t('HOME_PAGE_LINK_LABEL')}>
      <HedvigLogo />
    </LogoLink>
  )
}

export const LogoLink = styled(Link)({
  display: 'inline-block',
  '&:active': { opacity: 0.75 },
})
