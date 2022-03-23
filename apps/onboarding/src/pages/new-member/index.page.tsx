import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useState } from 'react'
import { Button, Heading, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { ResponsiveFooter } from '@/components/Nav/ResponsiveFooter'
import homeImg from './assets/home.jpg'
import { AdditionalCoverageCard, MainCoverageCard } from './components/coverage-cards'

const CardGrid = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 6px',
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
  textAlign: 'center',
  margin: '0 1rem',
  marginTop: '1rem',
  [mq.sm]: { margin: '0 8rem', marginTop: '3.5rem' },
})

const NewMemberPage: NextPage = () => {
  const [additionalCoverageSelected, setAdditionalCoverageSelected] = useState<boolean>(false)
  return (
    <PageContainer>
      <Header />
      <CardGrid>
        <ContentCard>
          <Heading variant="m" headingLevel="h2" colorVariant="dark" displayBlock>
            Get a personal quote
          </Heading>
          <BodyText variant={1} colorVariant="medium" displayBlock>
            Choose the add-ons you’d like with your Home Insurance, and in the next step, we’ll ask
            you a few follow-up questions.
          </BodyText>
        </ContentCard>
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" fixedSize headingLevel="h3">
            Main Coverage
          </Heading>
        </TitleContainer>
        <MainCoverageCard
          selected
          cardImg={homeImg}
          title="Home Insurance"
          description="Coverage for your house or apartment contents"
          wrapperStyles={{ gridColumn: '1 / span 2' }}
        />
        <TitleContainer>
          <Heading variant="xs" colorVariant="dark" fixedSize headingLevel="h3">
            Additional Coverage
          </Heading>
        </TitleContainer>
        <AdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title="Travel Insurance "
          description="Covers you and your family when you’re traveling"
          wrapperStyles={{ gridColumn: '1 / span 1' }}
        />
      </CardGrid>
      <ResponsiveFooter>
        <FooterButton $color="dark">Continue</FooterButton>
      </ResponsiveFooter>
    </PageContainer>
  )
}

export default NewMemberPage
