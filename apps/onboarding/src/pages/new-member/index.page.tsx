import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Heading, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { ResponsiveFooter } from '@/components/Nav/ResponsiveFooter'
import { AdditionalCoverageCard } from '@/components/new-member/coverage-cards/additional'
import { MainCoverageCard } from '@/components/new-member/coverage-cards/main'
import {
  getMarketFromLocaleLabel,
  getEmbarkInitialStore,
} from '@/components/new-member/new-member.helpers'
import { Insurances } from '@/components/new-member/types'
import { useCurrentLocale } from '@/lib/l10n'
import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/page-link'
import { Market } from '@/lib/types'

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

type NewMemberPageProps = {
  insurances: Insurances
  embarkInitialStore: Record<string, boolean>
}
const NewMemberPage: NextPage<NewMemberPageProps> = ({ insurances, embarkInitialStore }) => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const router = useRouter()

  const [embarkStore, setEmbarkStore] = useState(embarkInitialStore)
  const [redirecting, setRedirecting] = useState(false)

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

        {mainCoverageInsurances.map(({ name, description, img, embarkStoreKey }, index, arr) => {
          const isLastItem = index === arr.length - 1
          const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'
          const isSingleCard = arr.length === 1
          return (
            <GridMainCoverageCard
              key={name}
              selected={embarkStore[embarkStoreKey]}
              onCheck={
                !isSingleCard
                  ? () =>
                      setEmbarkStore((prevState) => ({
                        ...prevState,
                        [embarkStoreKey]: !prevState[embarkStoreKey],
                      }))
                  : undefined
              }
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
        {additionalCoverageInsurances.map(({ name, description, img, embarkStoreKey }) => (
          <GridAdditionalCoverageCard
            key={name}
            enableHover
            cardImg={img}
            selected={embarkStore[embarkStoreKey]}
            onCheck={() =>
              setEmbarkStore((prevState) => ({
                ...prevState,
                [embarkStoreKey]: !prevState[embarkStoreKey],
              }))
            }
            title={t(name)}
            description={t(description)}
          />
        ))}
      </CardGrid>
      <ResponsiveFooter>
        <FooterButton
          onClick={() => {
            setRedirecting(true)
            window.sessionStorage.setItem('embark-store-onboarding-NO', JSON.stringify(embarkStore))
            router.push(PageLink.embark({ locale: locale.path, storyName: 'onboarding' }))
          }}
          color="dark"
          disabled={redirecting}
        >
          {t('START_SCREEN_SUBMIT_BUTTON')}
        </FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<NewMemberPageProps> = async (context) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (context.locale === 'default') {
    return { notFound: true }
  }

  // TODO make usage of a proper API
  // This is being hardcoded at the moment but in the future that kind of information
  // will be retrieved from an proper API
  const INSURANCES_BY_MARKET: Record<Market, Insurances> = {
    [Market.Sweden]: [],
    [Market.Denmark]: [],
    [Market.Norway]: [
      {
        id: 'no-home-contents',
        name: 'MAIN_COVERAGE_TITLE_HOME',
        description: 'MAIN_COVERAGE_DESC_HOME',
        img: '/racoon-assets/home.jpg',
        isPreselected: true,
        embarkStoreKey: 'isHomeContents',
      },
      {
        id: 'no-travel',
        name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
        description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
        img: '/racoon-assets/travel.jpg',
        isAdditionalCoverage: true,
        embarkStoreKey: 'isTravel',
      },
      {
        id: 'no-accident',
        name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
        description: 'MAIN_COVERAGE_DESC_ACCIDENT',
        img: '/racoon-assets/accident.jpg',
        isAdditionalCoverage: true,
        embarkStoreKey: 'isAccident',
      },
    ],
  }

  const locale = context.locale as LocaleLabel
  const market = getMarketFromLocaleLabel(locale)
  const insurances = INSURANCES_BY_MARKET[market]

  if (insurances.length === 0) {
    return {
      notFound: true,
    }
  }

  if (market === Market.Norway && process.env.FEATURE_ACCIDENT_NO !== 'true') {
    const insurancesWithoutAccident = insurances.filter(
      (insurance) => insurance.id !== 'no-accident',
    )

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        insurances: insurancesWithoutAccident,
        embarkInitialStore: getEmbarkInitialStore(insurancesWithoutAccident),
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      insurances,
      embarkInitialStore: getEmbarkInitialStore(insurances),
    },
  }
}

export default NewMemberPage
