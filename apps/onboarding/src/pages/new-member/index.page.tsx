import styled from '@emotion/styled'
import type { NextPage } from 'next'
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
  return (
    <PageContainer>
      <Header />
      <CardGrid>
        <ContentCard>
          <Heading variant="m" headingLevel="h2" colorVariant="dark">
            Get a personal quote
          </Heading>
          <BodyText variant={1} colorVariant="medium" displayBlock>
            Choose the add-ons you’d like with your Home Insurance, and in the next step, we’ll ask
            you a few follow-up questions.
          </BodyText>
        </ContentCard>
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" headingLevel="h3">
            Main Coverage
          </Heading>
        </TitleContainer>
        <GridMainCoverageCard
          selected
          cardImg={homeImg}
          title="Home Insurance"
          description="Coverage for your house or apartment contents"
        />
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" headingLevel="h3">
            Additional Coverage
          </Heading>
        </TitleContainer>
        <GridAdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title="Travel Insurance "
          description="Covers you and your family when you’re traveling"
        />
      </CardGrid>
      <ResponsiveFooter>
        <FooterButton $color="dark">Continue</FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}

export default NewMemberPage
