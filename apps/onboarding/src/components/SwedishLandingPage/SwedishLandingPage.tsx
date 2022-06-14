import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { Heading, mq, Space } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { useTrackEvent } from '@/hooks/useTrackEvent'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import { LandingPageProps } from '../LandingPage/LandingPage'
import { ClickableCard } from './ClickableCard'

type GridCardProps = { size: 'half' | 'full' }

const GridClickableCard = styled(ClickableCard)<GridCardProps>((props) => ({
  gridColumn: '1 / span 2',

  [mq.sm]: { gridColumn: props.size === 'half' ? 'span 1' : '1 / span 2' },
}))

const PageWrapper = styled.div({
  padding: '0 1rem',
  margin: 'auto',
  maxWidth: '57rem',
  marginBottom: 'auto',
  marginTop: 0,
  paddingBottom: '2rem',

  [mq.sm]: {
    paddingBottom: 0,
  },
})

const CoverageCardGrid = styled.div({
  display: 'grid',
  gap: '1rem',
  width: '100%',

  [mq.sm]: {
    gridTemplateColumns: '1fr 1fr',
  },
})

const PageContainer = styled.main((props) => ({
  backgroundColor: props.theme.colors.gray100,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}))

const ContentCard = styled.div({
  margin: '1rem 1rem 0 0',
  [mq.sm]: { margin: '0 8rem', marginTop: '3.5rem', textAlign: 'center' },
})

type SwedishLandingPageProps = Pick<LandingPageProps, 'mainCoverageInsurances' | 'referer'>

export const SwedishLandingPage = ({
  mainCoverageInsurances,
  referer,
}: SwedishLandingPageProps) => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()

  const trackPageView = useTrackEvent('begin_onboarding_page', {
    begin_from: referer,
  })

  const trackSelectedCard = useTrackEvent('begin_onboarding_insurance_type_selected')

  useEffect(() => {
    trackPageView()
  }, [trackPageView])

  const handleClick = (type: string) => {
    trackSelectedCard({ flow_type: type })
  }

  return (
    <PageContainer>
      <Header />
      <PageWrapper>
        <Space y={{ base: 1.5, md: 5 }}>
          <ContentCard>
            <Space y={1.5}>
              <Heading variant="m" headingLevel="h1" colorVariant="dark">
                {t('LANDING_PAGE_HEADLINE')}
              </Heading>
              <BodyText variant={1} colorVariant="medium" displayBlock>
                {t('LANDING_PAGE_SUBHEADER_NO_ADDITIONAL_COVERAGE')}
              </BodyText>
            </Space>
          </ContentCard>
          <CoverageCardGrid>
            {mainCoverageInsurances.map(({ id, name, description, img, slug }, index, arr) => {
              const isLastItem = index === arr.length - 1
              const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'

              return (
                <GridClickableCard
                  key={id}
                  cardImg={img}
                  title={t(name)}
                  description={t(description)}
                  size={cardSize}
                  href={PageLink.embark({ locale: locale.path, slug })}
                  onClick={() => handleClick(id)}
                />
              )
            })}
          </CoverageCardGrid>
        </Space>
      </PageWrapper>
    </PageContainer>
  )
}
