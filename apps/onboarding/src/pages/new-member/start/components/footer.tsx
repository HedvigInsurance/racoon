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
      Genom att fortsätta bekräftar jag att jag har tagit del av information om Hedvigs
      personuppgiftpolicy.{' '}
      <TextLink href="https://www.hedvig.com/se-en/privacy-policy">Läs mer</TextLink>
    </FooterText>
  )
}
