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
import { LocaleLabel } from '@/lib/l10n/locales'
import { getMarketFromLocaleLabel, MarketInsurance } from '@/lib/l10n/markets'

const CardGrid = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1rem',
  margin: 'auto',
  gap: 6,
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
  textAlign: 'center',
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

type GridCardProps = { size: 'half' | 'full' }
const GridMainCoverageCard = styled(MainCoverageCard)<GridCardProps>((props) => ({
  gridColumn: '1 / span 2',
  [mq.sm]: { gridColumn: props.size === 'half' ? 'span 1' : '1 / span 2' },
}))
const GridAdditionalCoverageCard = styled(AdditionalCoverageCard)({ gridArea: 'span 1' })

type Props = {
  insurances: MarketInsurance[]
}
const NewMemberPage: NextPage<Props> = ({ insurances }) => {
  const [selected, setSelected] = useState(false)
  const { t } = useTranslation()
  const mainCoverageInsurances = insurances.filter(
    ({ isAdditionalCoverage }) => !isAdditionalCoverage,
  )
  const additionalCoverageInsurances = insurances.filter(
    ({ isAdditionalCoverage }) => isAdditionalCoverage,
  )
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

        {mainCoverageInsurances.map(({ name, description, img }, index, arr) => {
          const isLastItem = index === arr.length - 1
          const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'
          const isSingleCard = arr.length === 1
          return (
            <GridMainCoverageCard
              key={name}
              selected={selected}
              onCheck={!isSingleCard ? () => setSelected(!selected) : undefined}
              cardImg={img}
              title={t(name)}
              description={t(description)}
              size={cardSize}
            />
          )
        })}
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" headingLevel="h3">
            {t('LANDING_PAGE_SECTION_TITLE_ADDITIONAL')}
          </Heading>
        </TitleContainer>
        {additionalCoverageInsurances.map(({ name, description, img }) => (
          <GridAdditionalCoverageCard
            key={name}
            enableHover
            cardImg={img}
            selected={selected}
            onCheck={() => setSelected(!selected)}
            title={t(name)}
            description={t(description)}
          />
        ))}
      </CardGrid>
      <ResponsiveFooter>
        <FooterButton color="dark">{t('START_SCREEN_SUBMIT_BUTTON')}</FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (locale === 'default') {
    return {
      notFound: true,
    }
  }

  const currentMarket = getMarketFromLocaleLabel(locale as LocaleLabel)

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
      insurances: currentMarket.insurances,
    },
  }
}

export default NewMemberPage
