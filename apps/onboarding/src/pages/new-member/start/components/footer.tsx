import { PageLink } from '@/lib/page-link'
import styled from '@emotion/styled'
import { useCurrentLocale } from '@/lib/l10n'

const FooterText = styled.p(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.colors.gray500,
  textAlign: 'center',
}))

const TextLink = styled.a(({ theme }) => ({
  color: theme.colors.gray500,
  cursor: 'pointer',
}))

export const Footer = () => {
  const { path } = useCurrentLocale()

  return (
    <FooterText>
      Genom att fortsätta bekräftar jag att jag har tagit del av information om Hedvigs
      personuppgiftpolicy.{' '}
      <TextLink href={PageLink.privacy_policy({ locale: path })}>Läs mer</TextLink>
    </FooterText>
  )
}
