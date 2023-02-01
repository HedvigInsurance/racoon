import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { HedvigLogo, Space, mq, theme } from 'ui'
import { LanguageSwitcher } from '@/components/language-switcher'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  backgroundColor: theme.colors.white,
  height: '100vh',

  [mq.lg]: {
    padding: '2.5rem 3.5rem',
  },
})

const Header = styled.header({
  display: 'flex',
  justifyContent: 'center',
  flexShrink: 0,

  [mq.lg]: {
    justifyContent: 'flex-start',
  },
})

const SiteLink = styled.a({
  color: theme.colors.gray900,

  '&:hover': {
    color: theme.colors.purple900,
  },
})

const Main = styled(Space)({
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Footer = styled(Space)({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Paragraph = styled.div({
  fontSize: '0.75rem',
  color: theme.colors.gray700,
  textAlign: 'center',
  maxWidth: '36rem',

  [mq.lg]: {
    fontSize: '0.875rem',
  },

  a: {
    color: theme.colors.purple900,
    textDecoration: 'underline',
  },
})

const Content = styled.div({
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '24rem',
})

type PageLayoutProps = {
  children: React.ReactNode
  className?: string
  code?: string
}

export const PageLayout = ({ children, className, code }: PageLayoutProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('FOREVER_LANDINGPAGE_TITLE')}</title>

        <meta property="og:title" content={t('FOREVER_LANDINGPAGE_TITLE')} />
        {code && (
          <meta
            property="og:description"
            content={t('FOREVER_LANDINGPAGE_DESCRIPTION', { CODE: code.toUpperCase() })}
          />
        )}
        <meta
          property="og:image"
          content="https://www.hedvig.com/new-member-assets/social/forever-notifications.jpg"
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <Wrapper>
        <Header>
          <SiteLink href="/">
            <HedvigLogo />
          </SiteLink>
        </Header>
        <Main y={{ base: 2.5, lg: 0 }} as="main">
          <Content className={className}>{children}</Content>
          <Footer y={2.5} as="footer">
            <Paragraph dangerouslySetInnerHTML={{ __html: t('FOREVER_LANDINGPAGE_INFO_TEXT') }} />
            <LanguageSwitcher />
          </Footer>
        </Main>
      </Wrapper>
    </>
  )
}
