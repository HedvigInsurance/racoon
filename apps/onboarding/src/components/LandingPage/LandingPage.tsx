import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Button, Heading, mq, Space } from 'ui'
import { BodyText } from '@/components/BodyText'
import { FixedFooter } from '@/components/FixedFooter'
import { Header } from '@/components/Nav/Header'
import { useFeature, Feature } from '@/hooks/useFeature'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import { Embark } from '@/services/embark'
import { AdditionalCoverageCard } from './AdditionalCoverageCard'
import { Insurances } from './LandingPage.types'
import { MainCoverageCard } from './MainCoverageCard'

type GridCardProps = { size: 'half' | 'full' }

const GridMainCoverageCard = styled(MainCoverageCard)<GridCardProps>((props) => ({
  gridColumn: '1 / span 2',
  [mq.sm]: { gridColumn: props.size === 'half' ? 'span 1' : '1 / span 2' },
}))

const Main = styled.div({
  padding: '0 1rem',
  paddingBottom: `calc(${FixedFooter.HEIGHT} + 2rem)`,
  margin: 'auto',
  maxWidth: '53rem',
  marginTop: 0,
})

const CoverageCardGrid = styled.div({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: '1fr 1fr',
  width: '100%',
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

  [mq.sm]: {
    display: 'block',
  },
}))

const FooterButton = styled(Button)({
  width: '100%',
  justifyContent: 'center',

  [mq.sm]: {
    width: 'auto',
  },
})

const ContentCard = styled.div({
  margin: '1rem 1rem 0 0',
  [mq.sm]: { margin: '0 8rem', marginTop: '3.5rem', textAlign: 'center' },
})

export type LandingPageProps = {
  mainCoverageInsurances: Insurances
  additionalCoverageInsurances: Insurances
  formInitialState: Record<string, boolean>
}

export const LandingPage = ({
  mainCoverageInsurances,
  additionalCoverageInsurances,
  formInitialState,
}: LandingPageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const locale = useCurrentLocale()

  const [formState, setFormState] = useState(formInitialState)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const [IS_HOUSE_INSURANCE_ENABLED] = useFeature([Feature.HOUSE_INSURANCE])

  const hasSelectedAtLeastOneMainInsurance = useMemo(
    () => mainCoverageInsurances.some((insurance) => formState[insurance.fieldName]),
    [formState, mainCoverageInsurances],
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()

        setIsRedirecting(true)
        Embark.setStore(locale, formState)
        const slug = Embark.getSlug(locale)
        router.push(PageLink.embark({ locale: locale.path, slug }))
      }}
    >
      <PageContainer>
        <Header />
        <Main>
          <ContentCard>
            <Space y={1.5}>
              <Heading variant="m" headingLevel="h2" colorVariant="dark">
                {t('LANDING_PAGE_HEADLINE')}
              </Heading>
              <BodyText variant={1} colorVariant="medium" displayBlock>
                {t(
                  IS_HOUSE_INSURANCE_ENABLED
                    ? 'LANDING_PAGE_MULTI_MAIN_COVERAGE_SUBHEADING'
                    : 'LANDING_PAGE_SUBHEADING',
                )}
              </BodyText>
            </Space>
          </ContentCard>

          <TitleContainer>
            <Heading variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_MAIN')}
            </Heading>
          </TitleContainer>

          <CoverageCardGrid>
            {mainCoverageInsurances.map((inrurance, index, arr) => {
              const isLastItem = index === arr.length - 1
              const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'
              const isSingleCard = arr.length === 1
              return (
                <GridMainCoverageCard
                  key={inrurance.id}
                  selected={formState[inrurance.fieldName]}
                  required={!hasSelectedAtLeastOneMainInsurance}
                  errorMessage={t('LANDING_PAGE_MISSING_MAIN_COVERAGE_ERROR')}
                  onCheck={
                    !isSingleCard
                      ? () =>
                          setFormState({
                            ...formState,
                            [inrurance.fieldName]: !formState[inrurance.fieldName],
                          })
                      : undefined
                  }
                  cardImg={inrurance.img}
                  title={t(inrurance.name)}
                  description={t(inrurance.description)}
                  size={cardSize}
                />
              )
            })}
          </CoverageCardGrid>

          <TitleContainer>
            <Heading variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_ADDITIONAL')}
            </Heading>
          </TitleContainer>

          <CoverageCardGrid>
            {additionalCoverageInsurances.map((insurance) => (
              <AdditionalCoverageCard
                key={insurance.id}
                enableHover
                cardImg={insurance.img}
                selected={formState[insurance.fieldName]}
                disabled={!hasSelectedAtLeastOneMainInsurance}
                onCheck={() =>
                  setFormState({
                    ...formState,
                    [insurance.fieldName]: !formState[insurance.fieldName],
                  })
                }
                title={t(insurance.name)}
                description={t(insurance.description)}
              />
            ))}
          </CoverageCardGrid>
        </Main>
        <FixedFooter>
          <FooterButton color="dark" disabled={isRedirecting}>
            {t('START_SCREEN_SUBMIT_BUTTON')}
          </FooterButton>
        </FixedFooter>
      </PageContainer>
    </form>
  )
}
