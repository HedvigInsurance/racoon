import styled from '@emotion/styled'

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
  return (
    <FooterText>
      By continuing, I confirm that I have received information about Hedvig&apos;s personal data
      policy. <TextLink href="https://www.hedvig.com/se-en/privacy-policy">Read more</TextLink>
    </FooterText>
  )
}
