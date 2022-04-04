import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Button, Heading, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { ResponsiveFooter } from '@/components/Nav/ResponsiveFooter'
import { AdditionalCoverageCard } from '@/components/new-member/coverage-cards/additional'
import { MainCoverageCard } from '@/components/new-member/coverage-cards/main'
import homeImg from './assets/home.jpg'

const CardGrid = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1rem',
  margin: 'auto',
  columnGap: 6,
  maxWidth: '53rem',
  gridAutoColumns: '1fr 1fr',
  marginBottom: 'auto',
  marginTop: 0,
  paddingBottom: '2rem',
  [mq.sm]: {
    paddingBottom: 0,
  },
})

const TitleContainer = styled.div({
  gridColumn: '1 / span 2',
  marginBottom: '1rem',
  marginTop: '1.5rem',
  [mq.sm]: {
    marginTop: '3rem',
  },
})

const PageContainer = styled.main((props) => ({
  backgroundColor: props.theme.colors.gray100,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}))

const FooterButton = styled(Button)({
  width: '100%',
  [mq.sm]: {
    width: 'auto',
    marginTop: '5rem',
    marginBottom: '3.5rem',
  },
})

const ContentCard = styled.div({
  gridColumn: '1 / span 2',
  textAlign: 'start',
  margin: '1rem 1rem 0 0',
  [mq.sm]: { margin: '0 8rem', marginTop: '3.5rem', textAlign: 'center' },
})

const GridMainCoverageCard = styled(MainCoverageCard)({ gridColumn: '1 / span 2' })
const GridAdditionalCoverageCard = styled(AdditionalCoverageCard)({ gridColumn: '1 / span 1' })

const NewMemberPage: NextPage = () => {
  const [additionalCoverageSelected, setAdditionalCoverageSelected] = useState(false)
  const { t } = useTranslation()
  return (
    <PageContainer>
      <Header />
      <CardGrid>
        <ContentCard>
          <Heading variant="m" headingLevel="h2" colorVariant="dark">
            {t('LANDING_PAGE_HEADLINE')}
          </Heading>
          <BodyText variant={1} colorVariant="medium" displayBlock>
            {t('LANDING_PAGE_SUBHEADING')}
          </BodyText>
        </ContentCard>
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" headingLevel="h3">
            {t('LANDING_PAGE_SECTION_TITLE_MAIN')}
          </Heading>
        </TitleContainer>
        <GridMainCoverageCard
          selected
          cardImg={homeImg}
          title={t('MAIN_COVERAGE_TITLE_HOME')}
          description={t('MAIN_COVERAGE_DESC_HOME')}
        />
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" headingLevel="h3">
            {t('LANDING_PAGE_SECTION_TITLE_ADDITIONAL')}
          </Heading>
        </TitleContainer>
        <GridAdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title={t('ADDITIONAL_COVERAGE_TITLE_TRAVEL')}
          description={t('ADDITIONAL_COVERAGE_DESC_TRAVEL')}
        />
      </CardGrid>
      <ResponsiveFooter>
        <FooterButton color="dark">{t('START_SCREEN_SUBMIT_BUTTON')}</FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  }
}

export default NewMemberPage
