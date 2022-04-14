import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Heading, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { ResponsiveFooter } from '@/components/Nav/ResponsiveFooter'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/page-link'
import { Embark } from '@/services/embark'
import { AdditionalCoverageCard } from './AdditionalCoverageCard'
import { Insurances } from './LandingPage.types'
import { MainCoverageCard } from './MainCoverageCard'

type GridCardProps = { size: 'half' | 'full' }

const GridMainCoverageCard = styled(MainCoverageCard)<GridCardProps>((props) => ({
  gridColumn: '1 / span 2',
  [mq.sm]: { gridColumn: props.size === 'half' ? 'span 1' : '1 / span 2' },
}))

const GridAdditionalCoverageCard = styled(AdditionalCoverageCard)({ gridArea: 'span 1' })

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
  justifyContent: 'center',
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

type LandingPageProps = {
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

  return (
    <PageContainer>
      <Header />
      <form
        id="landing-page-form"
        onSubmit={(event) => {
          event.preventDefault()

          setIsRedirecting(true)
          Embark.setStore(locale, formState)
          const slug = Embark.getSlug(locale)
          router.push(PageLink.embark({ locale: locale.path, slug }))
        }}
      >
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

          {mainCoverageInsurances.map(({ id, name, description, img, fieldName }, index, arr) => {
            const isLastItem = index === arr.length - 1
            const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'
            const isSingleCard = arr.length === 1
            return (
              <GridMainCoverageCard
                key={id}
                selected={formState[fieldName]}
                onCheck={
                  !isSingleCard
                    ? () =>
                        setFormState({
                          ...formState,
                          [fieldName]: !formState[fieldName],
                        })
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
          {additionalCoverageInsurances.map(({ id, name, description, img, fieldName }) => (
            <GridAdditionalCoverageCard
              key={id}
              enableHover
              cardImg={img}
              selected={formState[fieldName]}
              onCheck={() =>
                setFormState({
                  ...formState,
                  [fieldName]: !formState[fieldName],
                })
              }
              title={t(name)}
              description={t(description)}
            />
          ))}
        </CardGrid>
      </form>
      <ResponsiveFooter>
        <FooterButton type="submit" form="landing-page-form" color="dark" disabled={isRedirecting}>
          {t('START_SCREEN_SUBMIT_BUTTON')}
        </FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}
