import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Button, HeadingOLD, mq } from 'ui'
import { FixedFooter } from '@/components/FixedFooter'
import { Header } from '@/components/Nav/Header'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import { Embark } from '@/services/embark'
import { Insurance } from '@/services/insurances'
import { AdditionalCoverageCard } from './AdditionalCoverageCard'
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

export type OldLandingPageProps = {
  mainCoverageInsurances: Array<Insurance>
  additionalCoverageInsurances: Array<Insurance>
  formInitialState: Record<string, boolean>
  referer: string | null
}

export const OldLandingPage = ({
  mainCoverageInsurances,
  additionalCoverageInsurances,
  formInitialState,
}: OldLandingPageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const locale = useCurrentLocale()

  const [formState, setFormState] = useState(formInitialState)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const hasSelectedAtLeastOneMainInsurance = useMemo(
    () => mainCoverageInsurances.some((insurance) => formState[insurance.fieldName]),
    [formState, mainCoverageInsurances],
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()

        setIsRedirecting(true)
        Embark.setStore(locale.market, formState)
        const slug = Embark.getSlug(locale.market)
        router.push(PageLink.embark({ locale: locale.path, slug }))
      }}
    >
      <PageContainer>
        <Header />
        <Main>
          <TitleContainer>
            <HeadingOLD variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_MAIN')}
            </HeadingOLD>
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
                  onCheck={() => {
                    if (!isSingleCard) {
                      setFormState({
                        ...formState,
                        [inrurance.fieldName]: !formState[inrurance.fieldName],
                      })
                    }
                  }}
                  cardImg={inrurance.img}
                  title={t(inrurance.name)}
                  description={t(inrurance.description)}
                  size={cardSize}
                  enableHover={true}
                />
              )
            })}
          </CoverageCardGrid>

          <TitleContainer>
            <HeadingOLD variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_ADDITIONAL')}
            </HeadingOLD>
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
            {t('LANDING_PAGE_SUBMIT_BUTTON')}
          </FooterButton>
        </FixedFooter>
      </PageContainer>
    </form>
  )
}