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
      By continuing, I confirm that I have received information about Hedvig&apos;s personal data
      policy. <TextLink href={PageLink.privacy_policy({ locale: path })}>Read more</TextLink>
    </FooterText>
  )
}
